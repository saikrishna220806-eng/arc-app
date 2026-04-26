// lib/gemini.ts
// Helper to call Gemini API via @google/generative-ai

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateFromGemini(
  prompt: string,
  retries = 3,
  delayMs = 5000
): Promise<string> {
  // gemini-2.5-flash — has available quota on this API key
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err: unknown) {
      const isQuota =
        err instanceof Error &&
        (err.message.includes("429") ||
          err.message.includes("RESOURCE_EXHAUSTED") ||
          err.message.includes("quota") ||
          err.message.includes("Too Many Requests"));

      if (isQuota && attempt < retries) {
        // Exponential back-off: 5s, 10s, 20s
        const wait = delayMs * Math.pow(2, attempt - 1);
        console.log(
          `[gemini] Rate limited (attempt ${attempt}/${retries}), retrying in ${wait}ms…`
        );
        await sleep(wait);
        continue;
      }
      console.error("Gemini Error:", err);
      throw err;
    }
  }
  throw new Error("Max retries exceeded after rate limit.");
}
