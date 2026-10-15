import type { Brief, Business } from "@/lib/types";

function SourceLinks({ urls }: { urls?: string[] }) {
  if (!urls?.length) return null;
  return (
    <p className="sources" style={{ marginTop: "0.55rem" }}>
      {urls.map((url, i) => (
        <span key={url}>
          {i > 0 ? " · " : ""}
          <a href={url} target="_blank" rel="noreferrer">
            source {i + 1}
          </a>
        </span>
      ))}
    </p>
  );
}

export function BriefView({
  brief,
  business,
}: {
  brief: Brief;
  business: Business | null;
}) {
  const p = brief.payload;
  const date = new Date(brief.created_at).toLocaleString();

  return (
    <div className="stack">
      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h2>Weekly intel brief</h2>
        <p className="section-lead">
          {business
            ? `${business.name} · ${business.niche} · ${business.city}`
            : "MarketPulse brief"}
        </p>
        <div className="meta-row">
          <span>{date}</span>
          <span className="chip">{p.sources.length} Tavily sources</span>
        </div>
        <div className="panel" style={{ marginTop: "1rem", padding: "1.1rem" }}>
          <p style={{ margin: 0, lineHeight: 1.55 }}>{p.summary}</p>
        </div>
      </section>

      <section className="section">
        <h2>Competitors</h2>
        <p className="section-lead">Who shows up nearby — and how they win.</p>
        <div className="panel">
          {p.competitors.length === 0 ? (
            <p className="empty">No competitor cards extracted.</p>
          ) : (
            p.competitors.map((c) => (
              <article className="item" key={`${c.name}-${c.summary}`}>
                <h3>{c.name}</h3>
                <p>{c.summary}</p>
                {c.strengths?.length ? (
                  <ul className="list-plain">
                    {c.strengths.map((s) => (
                      <li key={s}>Strength: {s}</li>
                    ))}
                  </ul>
                ) : null}
                {c.weaknesses?.length ? (
                  <ul className="list-plain">
                    {c.weaknesses.map((s) => (
                      <li key={s}>Gap: {s}</li>
                    ))}
                  </ul>
                ) : null}
                <SourceLinks urls={c.sourceUrls} />
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>Price signals</h2>
        <p className="section-lead">What the market is charging and promoting.</p>
        <div className="panel">
          {p.priceSignals.length === 0 ? (
            <p className="empty">No price signals extracted.</p>
          ) : (
            p.priceSignals.map((s) => (
              <article className="item" key={`${s.item}-${s.signal}`}>
                <h3>{s.item}</h3>
                <p>{s.signal}</p>
                <p>{s.evidence}</p>
                <SourceLinks urls={s.sourceUrls} />
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>Opportunities</h2>
        <p className="section-lead">Openings worth acting on this week.</p>
        <div className="panel">
          {p.opportunities.length === 0 ? (
            <p className="empty">No opportunities listed.</p>
          ) : (
            p.opportunities.map((o) => (
              <article className="item" key={o.title}>
                <h3>{o.title}</h3>
                <p>{o.detail}</p>
                <SourceLinks urls={o.sourceUrls} />
              </article>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>Content drafts</h2>
        <p className="section-lead">Three ready-to-adapt posts grounded in the research.</p>
        <div className="panel">
          {p.contentDrafts.map((d) => (
            <article className="item" key={`${d.channel}-${d.headline}`}>
              <h3>
                {d.channel}: {d.headline}
              </h3>
              <p>{d.body}</p>
              <p>Why: {d.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Action list</h2>
        <p className="section-lead">Concrete moves for the next seven days.</p>
        <div className="panel">
          {p.actions.map((a) => (
            <article className="item" key={a.action}>
              <div className={`priority ${a.priority}`}>{a.priority}</div>
              <h3>{a.action}</h3>
              <p>{a.rationale}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>All sources</h2>
        <p className="section-lead">
          Live web research via Tavily — every claim should be checkable.
        </p>
        <div className="panel">
          {p.sources.map((s) => (
            <article className="item" key={s.url}>
              <h3>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </a>
              </h3>
              <p>Query: {s.query}</p>
              <p>{s.snippet}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
