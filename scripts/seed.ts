/**
 * Optional CLI seed — prefer POST /api/seed while `next dev` is running.
 * This script mirrors the same Kigali café demo data for offline checks.
 */
import { createBusiness, listBusinesses, saveBrief } from "../src/lib/db";
import type { BriefPayload } from "../src/lib/types";

const payload: BriefPayload = {
  summary:
    "Kigali specialty coffee stays competitive on ambience and specialty drinks, while weekday lunch price bands are tightening.",
  competitors: [
    {
      name: "Question Coffee Café",
      summary: "Specialty positioning with origin storytelling.",
      strengths: ["Brand story"],
      weaknesses: ["Premium perception"],
      sourceUrls: ["https://example.com/question-coffee"],
    },
  ],
  priceSignals: [
    {
      item: "Specialty milk drinks",
      signal: "RWF 3,000–4,500 band in central Kigali",
      evidence: "Menu and review snippets.",
      sourceUrls: ["https://example.com/kigali-coffee-prices"],
    },
  ],
  opportunities: [
    {
      title: "Mid-week remote worker offer",
      detail: "Drink + pastry combo for 10–2 traffic.",
      sourceUrls: ["https://example.com/neo-coffee"],
    },
  ],
  contentDrafts: [
    {
      channel: "Instagram Reel",
      headline: "From farm notes to your cup",
      body: "Today's single-origin in 20 seconds.",
      why: "Story wins in specialty coffee.",
    },
    {
      channel: "WhatsApp Status",
      headline: "Midweek focus fuel",
      body: "Quiet tables 10am–2pm.",
      why: "Local channel fit.",
    },
    {
      channel: "Google Business Profile",
      headline: "Laptop-friendly midday",
      body: "Wi-Fi ready seating note.",
      why: "Maps discovery.",
    },
  ],
  actions: [
    {
      priority: "high",
      action: "Launch midweek combo",
      rationale: "Weekday demand signal.",
    },
  ],
  sources: [
    {
      title: "Seed source",
      url: "https://example.com/question-coffee",
      snippet: "Demo source",
      query: "specialty coffee Kigali",
    },
  ],
};

const existing = listBusinesses().find((b) => b.name === "Ikawa House");
if (existing) {
  console.log("Seed already present:", existing.id);
  process.exit(0);
}

const business = createBusiness({
  name: "Ikawa House",
  niche: "specialty coffee café",
  city: "Kigali",
  competitors: "Question Coffee, Neo Coffeehouse",
  goals: ["traffic", "pricing", "content"],
});
const brief = saveBrief(business.id, payload);
console.log("Seeded business", business.id, "brief", brief.id);
