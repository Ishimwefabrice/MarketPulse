import { OnboardForm } from "@/components/OnboardForm";
import { SeedDemoButton } from "@/components/SeedDemoButton";
import { listBusinesses } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const businesses = listBusinesses();

  return (
    <>
      <section className="hero">
        <h1>
          Market<span>Pulse</span>
        </h1>
        <p>
          Weekly competitive intel for small businesses — competitor scan, price
          signals, content drafts, and an action list from live web research.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href="#onboard">
            Start a brief
          </a>
          <SeedDemoButton />
        </div>
      </section>

      <section className="section" id="onboard">
        <h2>Tell us about the business</h2>
        <p className="section-lead">
          One form. One run. A brief you can act on this week — powered by
          NVIDIA Nemotron on Nebius Token Factory and Tavily search.
        </p>
        <OnboardForm />
      </section>

      {businesses.length > 0 ? (
        <section className="section">
          <h2>Your businesses</h2>
          <p className="section-lead">Pick up where you left off.</p>
          <div className="panel">
            <ul className="history-list">
              {businesses.map((b) => (
                <li key={b.id}>
                  <a href={`/business/${b.id}`}>
                    <span>
                      {b.name} · {b.niche}
                    </span>
                    <span>{b.city}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
