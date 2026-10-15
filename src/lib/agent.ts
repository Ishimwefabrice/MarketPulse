import { completeJson, MODEL_FAST, MODEL_REASON } from "./nebius";
import { tavilySearch } from "./tavily";
import type {
  ActionItem,
  BriefPayload,
  Business,
  CompetitorCard,
  ContentDraft,
  Opportunity,
  PriceSignal,
  Source,
} from "./types";

interface QueryPlan {
  queries: string[];
}

interface Extraction {
  competitors: CompetitorCard[];
  priceSignals: PriceSignal[];
  themes: string[];
}

interface Synthesis {
  summary: string;
  opportunities: Opportunity[];
  contentDrafts: ContentDraft[];
  actions: ActionItem[];
}

function uniqueSources(sources: Source[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const s of sources) {
    if (seen.has(s.url)) continue;
    seen.add(s.url);
    out.push(s);
  }
  return out;
}

async function planQueries(business: Business): Promise<string[]> {
  const known = business.competitors
    ? `Known competitors: ${business.competitors}.`
    : "No known competitors provided.";
  const goals = business.goals.length
    ? business.goals.join(", ")
    : "traffic, pricing, content";

  const plan = await completeJson<QueryPlan>({
    model: MODEL_FAST,
    system:
      "You plan web research for small-business competitive intelligence. Return JSON only: {\"queries\": string[]} with 4 to 6 concrete search queries. Prefer local market, pricing, reviews, and competitor discovery. No markdown.",
    user: `Business: ${business.name}
Niche: ${business.niche}
City/region: ${business.city}
Goals: ${goals}
${known}

Produce search queries that uncover competitors, price signals, customer reviews, and recent local market news.`,
  });

  const queries = (plan.queries ?? [])
    .map((q) => q.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (queries.length === 0) {
    return [
      `${business.niche} competitors in ${business.city}`,
      `${business.niche} prices ${business.city}`,
      `best ${business.niche} ${business.city} reviews`,
      `${business.niche} market trends ${business.city}`,
    ];
  }
  return queries;
}

async function extractSignals(
  business: Business,
  sources: Source[],
): Promise<Extraction> {
  const corpus = sources
    .map(
      (s, i) =>
        `[${i + 1}] ${s.title}\nURL: ${s.url}\nQuery: ${s.query}\n${s.snippet}`,
    )
    .join("\n\n");

  return completeJson<Extraction>({
    model: MODEL_FAST,
    system: `Extract competitive intelligence from web sources for an SME.
Return JSON only with shape:
{
  "competitors": [{"name","summary","strengths":[],"weaknesses":[],"sourceUrls":[]}],
  "priceSignals": [{"item","signal","evidence","sourceUrls":[]}],
  "themes": ["..."]
}
Only use provided source URLs. No markdown.`,
    user: `Business: ${business.name} (${business.niche}) in ${business.city}

Sources:
${corpus}`,
  });
}

async function synthesizeBrief(
  business: Business,
  extraction: Extraction,
  sources: Source[],
): Promise<Synthesis> {
  return completeJson<Synthesis>({
    model: MODEL_REASON,
    temperature: 0.4,
    system: `You are MarketPulse, an SME market-intel agent for East Africa.
Write a practical weekly brief grounded only in the extracted evidence.
Return JSON only:
{
  "summary": "2-4 sentences",
  "opportunities": [{"title","detail","sourceUrls":[]}],
  "contentDrafts": [{"channel","headline","body","why"}],
  "actions": [{"priority":"high|medium|low","action","rationale"}]
}
Provide exactly 3 contentDrafts and 4-6 actions. Prefer channels useful for local SMEs (Instagram, WhatsApp Status, Facebook, Google Business Profile). No markdown outside JSON.`,
    user: `Business: ${business.name}
Niche: ${business.niche}
City: ${business.city}
Goals: ${business.goals.join(", ") || "general growth"}

Extraction:
${JSON.stringify(extraction, null, 2)}

Available source URLs:
${sources.map((s) => `- ${s.url}`).join("\n")}`,
  });
}

export async function runIntelPipeline(
  business: Business,
): Promise<BriefPayload> {
  const queries = await planQueries(business);

  const batches = await Promise.all(
    queries.map(async (query) => {
      try {
        return await tavilySearch(query, { maxResults: 4 });
      } catch (err) {
        console.error("Tavily query failed:", query, err);
        return [] as Source[];
      }
    }),
  );

  const sources = uniqueSources(batches.flat());
  if (sources.length === 0) {
    throw new Error(
      "No web sources returned from Tavily. Check TAVILY_API_KEY and try again.",
    );
  }

  const extraction = await extractSignals(business, sources);
  const synthesis = await synthesizeBrief(business, extraction, sources);

  return {
    summary: synthesis.summary || "Weekly intel brief generated.",
    competitors: extraction.competitors ?? [],
    priceSignals: extraction.priceSignals ?? [],
    opportunities: synthesis.opportunities ?? [],
    contentDrafts: (synthesis.contentDrafts ?? []).slice(0, 3),
    actions: synthesis.actions ?? [],
    sources,
  };
}
