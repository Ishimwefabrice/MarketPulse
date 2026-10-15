import { notFound } from "next/navigation";
import { RunIntelButton } from "@/components/RunIntelButton";
import { getBusiness, listBriefsForBusiness } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = getBusiness(id);
  if (!business) notFound();
  const briefs = listBriefsForBusiness(id);

  return (
    <>
      <section className="section" style={{ marginTop: "2rem" }}>
        <h2>{business.name}</h2>
        <p className="section-lead">
          {business.niche} in {business.city}
        </p>
        <div className="meta-row">
          <span>Goals: {business.goals.join(", ") || "general"}</span>
          {business.competitors ? (
            <span>Competitors: {business.competitors}</span>
          ) : null}
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <RunIntelButton businessId={business.id} />
        </div>
      </section>

      <section className="section">
        <h2>Brief history</h2>
        <p className="section-lead">Past weekly intel runs for this business.</p>
        <div className="panel">
          {briefs.length === 0 ? (
            <p className="empty">No briefs yet — run weekly intel to generate one.</p>
          ) : (
            <ul className="history-list">
              {briefs.map((b) => (
                <li key={b.id}>
                  <a href={`/brief/${b.id}`}>
                    <span>Brief {b.id.slice(0, 8)}</span>
                    <span>{new Date(b.created_at).toLocaleString()}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
