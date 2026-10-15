# Devpost submission checklist

## Required

- [ ] Track: **Best Apps and Agents**
- [ ] Public GitHub repo with **MIT** license visible
- [ ] README explains Nebius Token Factory + NVIDIA Nemotron + Tavily
- [ ] Working demo URL or clear local run instructions
- [ ] Demo video ≤ 3 minutes on public YouTube
- [ ] Project description: what / why / how (use blurbs below)

## Optional prize angles

- [ ] **Best Use of Tavily** — research loop is the product core; briefs cite URLs
- [ ] City Winner (Builders & Brews) — associate submission with participating city if eligible

## Suggested Devpost blurb

**Tagline:** Weekly competitive intel for SMEs — powered by Nemotron and Tavily.

**Inspiration:** Small businesses need competitor and pricing awareness but cannot hire an analyst. MarketPulse turns a niche + city into an actionable weekly brief.

**What it does:** Onboard a business → agent plans searches → Tavily gathers the web → Nemotron extracts competitors/prices and writes drafts + actions → SQLite stores brief history.

**How we built it:** Next.js app calling Nebius Token Factory (`nvidia/Nemotron-3_5-Lightning` for planning/extraction, `nvidia/Nemotron-3-Super-120b-a12b` for synthesis) and Tavily Search. Local SQLite for businesses and briefs.

**Challenges:** Grounding content drafts in sources; keeping credit use low with a fast/slow model split.

**Accomplishments:** End-to-end form → brief UX; source citations; Rwanda-first café seed demo.

**What's next:** Scheduled weekly runs, WhatsApp delivery, multi-location chains.

## Env for judges

```
NEBIUS_API_KEY=...
TAVILY_API_KEY=...
```

Without keys, use **Open Kigali café demo** on the homepage.
