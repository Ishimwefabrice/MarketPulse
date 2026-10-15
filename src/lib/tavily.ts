import type { Source } from "./types";

interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
  snippet?: string;
}

interface TavilyResponse {
  results?: TavilyResult[];
}

export async function tavilySearch(
  query: string,
  options?: { maxResults?: number },
): Promise<Source[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TAVILY_API_KEY is missing. Copy .env.example to .env.local and add your Tavily key.",
    );
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      include_answer: false,
      max_results: options?.maxResults ?? 5,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Tavily search failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as TavilyResponse;
  return (data.results ?? [])
    .filter((r) => r.url)
    .map((r) => ({
      title: r.title?.trim() || r.url || "Untitled",
      url: r.url as string,
      snippet: (r.content || r.snippet || "").trim(),
      query,
    }));
}
