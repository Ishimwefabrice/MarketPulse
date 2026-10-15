import { NextResponse } from "next/server";
import { createBusiness, listBusinesses, saveBrief } from "@/lib/db";
import type { BriefPayload } from "@/lib/types";

const SEED_PAYLOAD: BriefPayload = {
  summary:
    "Kigali specialty coffee stays competitive on ambience and specialty drinks, while weekday lunch price bands are tightening. A clear weekly window exists around mid-week remote-worker traffic and short-form social proof.",
  competitors: [
    {
      name: "Question Coffee Café",
      summary:
        "Strong specialty positioning with origin storytelling and training culture.",
      strengths: ["Brand story", "Specialty credibility"],
      weaknesses: ["Premium price perception for casual visitors"],
      sourceUrls: ["https://example.com/question-coffee"],
    },
    {
      name: "Neo Coffeehouse",
      summary: "Busy central café known for workspace-friendly seating.",
      strengths: ["Location", "Laptop-friendly vibe"],
      weaknesses: ["Peak-hour crowding"],
      sourceUrls: ["https://example.com/neo-coffee"],
    },
  ],
  priceSignals: [
    {
      item: "Flat white / specialty milk drinks",
      signal: "Common band around RWF 3,000–4,500 in central Kigali cafés",
      evidence:
        "Multiple menu mentions and review snippets cluster in this range.",
      sourceUrls: ["https://example.com/kigali-coffee-prices"],
    },
    {
      item: "Weekday lunch combos",
      signal: "Competitors push value sets to capture remote workers",
      evidence: "Promo language around midday deals appears in recent posts.",
      sourceUrls: ["https://example.com/lunch-deals"],
    },
  ],
  opportunities: [
    {
      title: "Mid-week remote worker offer",
      detail:
        "Package a 10–2 laptop-friendly deal with drink + pastry to own quieter weekdays.",
      sourceUrls: ["https://example.com/neo-coffee"],
    },
    {
      title: "Origin story reels",
      detail:
        "Short vertical videos explaining bean origins outperform static menu posts in this niche.",
      sourceUrls: ["https://example.com/question-coffee"],
    },
  ],
  contentDrafts: [
    {
      channel: "Instagram Reel",
      headline: "From farm notes to your cup",
      body: "Watch our barista pull today's single-origin. Hint: citrus + honey. Tag a friend who needs a midweek reset.",
      why: "Specialty cafés win on story and sensory detail.",
    },
    {
      channel: "WhatsApp Status",
      headline: "Midweek focus fuel",
      body: "Quiet tables 10am–2pm. Flat white + pastry combo this week only. Reply FOCUS for details.",
      why: "Matches remote-worker traffic goal with low-friction local channel.",
    },
    {
      channel: "Google Business Profile",
      headline: "Updated lunch hours note",
      body: "Laptop-friendly seating midday. Specialty milk drinks prepared to order. Wi-Fi ready.",
      why: "Search intent for cafés often starts on Maps/GBP.",
    },
  ],
  actions: [
    {
      priority: "high",
      action: "Launch a midweek remote-worker combo and pin it on WhatsApp Status",
      rationale: "Price and seating signals point to weekday demand.",
    },
    {
      priority: "high",
      action: "Film one 20s origin/process reel this week",
      rationale: "Competitors lean on specialty storytelling.",
    },
    {
      priority: "medium",
      action: "Audit specialty drink prices vs RWF 3,000–4,500 band",
      rationale: "Stay intentional on premium vs value perception.",
    },
    {
      priority: "low",
      action: "Refresh Google Business photos of seating and drinks",
      rationale: "Improves discovery for visitors comparing cafés.",
    },
  ],
  sources: [
    {
      title: "Seed: Question Coffee profile",
      url: "https://example.com/question-coffee",
      snippet: "Specialty café and training culture in Kigali.",
      query: "specialty coffee competitors Kigali",
    },
    {
      title: "Seed: Neo Coffeehouse notes",
      url: "https://example.com/neo-coffee",
      snippet: "Central workspace-friendly café mentions.",
      query: "best cafes for remote work Kigali",
    },
    {
      title: "Seed: Kigali coffee price notes",
      url: "https://example.com/kigali-coffee-prices",
      snippet: "Menu and review snippets on specialty drink pricing.",
      query: "coffee prices Kigali cafes",
    },
    {
      title: "Seed: lunch deal mentions",
      url: "https://example.com/lunch-deals",
      snippet: "Midday value promotions for cafés.",
      query: "cafe lunch deals Kigali",
    },
  ],
};

export async function POST() {
  const existing = listBusinesses().find(
    (b) => b.name === "Ikawa House" && b.city === "Kigali",
  );
  if (existing) {
    return NextResponse.json({
      business: existing,
      message: "Seed business already exists",
    });
  }

  const business = createBusiness({
    name: "Ikawa House",
    niche: "specialty coffee café",
    city: "Kigali",
    competitors: "Question Coffee, Neo Coffeehouse",
    goals: ["traffic", "pricing", "content"],
  });
  const brief = saveBrief(business.id, SEED_PAYLOAD);
  return NextResponse.json({ business, brief }, { status: 201 });
}
