export async function generateFromGemini(prompt: string): Promise<string> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY || "",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Gemini API error:", data);
    throw new Error(data.error?.message || "Gemini API failed");
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}