# MarketPulse

**Weekly competitive intel for small businesses** — competitor scan, price signals, content drafts, and an action list.

Built for the **Nebius x NVIDIA Global AI Hackathon** · track: **Best Apps and Agents** (also targeting **Best Use of Tavily**).

## How it uses Nebius + NVIDIA + Tavily

| Piece | Role |
| --- | --- |
| **Nebius Token Factory** | OpenAI-compatible runtime inference API (`https://api.tokenfactory.nebius.com/v1/`) |
| **NVIDIA Nemotron 3.5 Lightning** | Plans search queries + extracts structured competitor/price signals |
| **NVIDIA Nemotron 3 Super** | Synthesizes the weekly brief, content drafts, and action list |
| **Tavily** | Live web research loop (competitors, prices, reviews, local news) — every brief cites source URLs |

Calling Nemotron through Token Factory satisfies the hackathon “runs on Nebius” requirement. The Next.js app can run locally or on any host.

## Quick start

```bash
cp .env.example .env.local
# set NEBIUS_API_KEY and TAVILY_API_KEY

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Enter a business (or click **Open Kigali café demo**)
2. Click **Run weekly intel**
3. Read the brief — competitors, prices, opportunities, drafts, actions, sources

### Credits (hackathon)

- Token Factory: form + activation code `NEBIUS-DEVPOST-GLOBAL26`
- Extra Token Factory + Tavily: [Nebius Builders Program](https://nebius.com/)

## Stack

- Next.js 15 (App Router) + TypeScript
- Local JSON store (`data/store.json`) for businesses + briefs
- OpenAI SDK → Nebius Token Factory
- Tavily Search API

## Project layout

```
src/
  app/                 # UI + API routes
  components/          # Onboard, run button, brief view
  lib/
    agent.ts           # plan → Tavily → extract → synthesize
    nebius.ts          # Token Factory client
    tavily.ts          # Search helper
    db.ts              # JSON file persistence
```

## Demo without live APIs

`POST /api/seed` (or the homepage demo button) loads **Ikawa House**, a Kigali specialty café sample brief, so judges can browse the UI without burning credits.

## License

MIT — see [LICENSE](./LICENSE).

## Hackathon submission notes

See [docs/DEMO_SCRIPT.md](./docs/DEMO_SCRIPT.md) and [docs/DEVPOST.md](./docs/DEVPOST.md).
