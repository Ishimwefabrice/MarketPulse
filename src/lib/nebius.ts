import OpenAI from "openai";

const BASE_URL = "https://api.tokenfactory.nebius.com/v1/";

export const MODEL_FAST =
  process.env.NEBIUS_MODEL_FAST ?? "nvidia/Nemotron-3_5-Lightning";

export const MODEL_REASON =
  process.env.NEBIUS_MODEL_REASON ?? "nvidia/Nemotron-3-Super-120b-a12b";

export function getNebiusClient(): OpenAI {
  const apiKey = process.env.NEBIUS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEBIUS_API_KEY is missing. Copy .env.example to .env.local and add your Token Factory key.",
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: BASE_URL,
  });
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not contain JSON object");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

export async function completeJson<T>(options: {
  model: string;
  system: string;
  user: string;
  temperature?: number;
}): Promise<T> {
  const client = getNebiusClient();
  const completion = await client.chat.completions.create({
    model: options.model,
    temperature: options.temperature ?? 0.3,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from Nebius Token Factory");
  }
  return extractJson(content) as T;
}
