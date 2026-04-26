// app/api/fair-answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateFromGemini } from "@/lib/gemini";

// Allow up to 90 seconds for the 3-agent pipeline
export const runtime = "nodejs";
export const maxDuration = 90;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const GLOBAL_FAIRNESS_RULES = `You are part of the "FairDecision AI" system — an unbiased and ethical decision-making assistant.
MISSION: Help users make fair, neutral and transparent decisions while actively detecting and reducing bias.
GLOBAL FAIRNESS RULES:
1. Never assume gender, caste, religion, race, nationality, age or income.
2. Base responses only on facts and context.
3. If info is missing, acknowledge uncertainty.
4. Avoid stereotypes or judgments.
5. Be neutral and professional.
6. Refuse harmful or discriminatory requests politely.`;

function buildAgentAPrompt(question: string): string {
  return `${GLOBAL_FAIRNESS_RULES}

You are Agent A — the Decision Maker.
Your task: Provide a neutral, factual answer to the user's question.
Return your response in EXACTLY this format with no extra text:

Initial Answer: [provide a concise, balanced answer here]
Reasoning: [explain your reasoning step by step]
Assumptions or Missing Info: [list any assumptions made or information that is missing]

User Question: ${question}`;
}

function buildAgentBPrompt(agentAOutput: string): string {
  return `${GLOBAL_FAIRNESS_RULES}

You are Agent B — the Bias Auditor.
Your task: Carefully review Agent A's answer for any bias.

Check for ALL of the following bias types:
- Gender bias (assumptions based on gender)
- Age bias (assumptions based on age)
- Cultural / Caste / Religious bias
- Economic / Socioeconomic bias  
- Missing perspectives or underrepresented viewpoints
- Overconfidence without sufficient evidence

Agent A's Answer to Review:
${agentAOutput}

Return your response in EXACTLY this format with no extra text:

Bias Found (Yes/No): [Yes or No]
Issues Detected: [list each issue found, or write "None detected"]
Suggested Corrections: [specific corrections to apply, or write "No corrections needed"]
Confidence Score (0-100): [a number from 0-100 representing answer confidence]`;
}

function buildAgentCPrompt(
  question: string,
  agentAOutput: string,
  agentBOutput: string
): string {
  return `${GLOBAL_FAIRNESS_RULES}

You are Agent C — the Final Judge.
Your task: Compare Agent A's answer and Agent B's audit, then produce the final fair and unbiased answer.

Decision Logic:
- If bias was found → incorporate Agent B's corrections into the final answer
- If no bias was found → approve and refine Agent A's answer
- Ensure a neutral, balanced, professional tone throughout
- The answer should be comprehensive but concise (2-4 paragraphs)

Original Question: ${question}

Agent A Output:
${agentAOutput}

Agent B Audit:
${agentBOutput}

Return your response in EXACTLY this format with absolutely no extra text before or after:

Final Answer: [write a complete, fair, 2-4 paragraph answer here]
Reasoning based on facts: [1-2 sentences explaining the factual basis]
Why this answer is fair: [1-2 sentences explaining how bias was addressed]
Confidence Score (0-100): [a single number only, e.g. 87]
Bias Risk Level (Low/Medium/High): [exactly one word: Low, Medium, or High]`;
}

function parseAgentCOutput(output: string): {
  answer: string;
  confidence: string;
  bias: string;
} {
  // Extract each field using regex
  const extract = (key: string): string => {
    const regex = new RegExp(`${key}:\\s*([\\s\\S]*?)(?=\\n[A-Z][^\\n:]+:|$)`, "i");
    const match = output.match(regex);
    return match ? match[1].trim() : "";
  };

  const finalAnswer = extract("Final Answer");
  const confidenceRaw = extract("Confidence Score \\(0-100\\)");
  const biasRaw = extract("Bias Risk Level \\(Low\\/Medium\\/High\\)");

  // Parse confidence number
  const confMatch = confidenceRaw.match(/\d+/);
  const confNum = confMatch ? Math.min(100, Math.max(0, parseInt(confMatch[0]))) : 80;

  // Parse bias level (extract just first word)
  const biasWord = biasRaw.split(/[\s,\.]/)[0] || "Low";
  const validBias = ["Low", "Medium", "High"].includes(biasWord) ? biasWord : "Low";

  return {
    answer: finalAnswer || output,
    confidence: `${confNum}%`,
    bias: validBias,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question } = body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured. Please add it to .env.local" },
        { status: 500 }
      );
    }

    // ─── Agent A: Decision Maker ───────────────────────────────────────
    const agentAPrompt = buildAgentAPrompt(question.trim());
    const agentAOutput = await generateFromGemini(agentAPrompt);
    await sleep(4000);

    // ─── Agent B: Bias Auditor ─────────────────────────────────────────
    const agentBPrompt = buildAgentBPrompt(agentAOutput);
    const agentBOutput = await generateFromGemini(agentBPrompt);
    await sleep(4000);

    // ─── Agent C: Final Judge ──────────────────────────────────────────
    const agentCPrompt = buildAgentCPrompt(question.trim(), agentAOutput, agentBOutput);
    const agentCOutput = await generateFromGemini(agentCPrompt);

    // ─── Parse Result ──────────────────────────────────────────────────
    const result = parseAgentCOutput(agentCOutput);

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("🔥 FULL API ERROR:", err);

    let message = "Something went wrong.";

    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
  if (err instanceof Error) {
    if (err.message.includes("API_KEY_INVALID") || err.message.includes("API key not valid")) {
      message = "Invalid Gemini API key. Please add a valid GEMINI_API_KEY to your .env.local file and restart the server. Get a free key at https://aistudio.google.com/app/apikey";
    } else if (
      err.message.includes("QUOTA_EXCEEDED") ||
      err.message.includes("quota") ||
      err.message.includes("429") ||
      err.message.includes("RESOURCE_EXHAUSTED")
    ) {
      message = "Gemini API rate limit hit. The 3-agent pipeline uses 3 API calls — please wait 60 seconds and try again. Consider upgrading your Gemini API plan at https://aistudio.google.com";
    } else if (err.message.includes("fetch") || err.message.includes("network")) {
      message = "Network error connecting to Gemini API. Please check your internet connection.";
    } else {
      message = err.message;
    }
  }
  return NextResponse.json({ error: message }, { status: 500 });
}
}
