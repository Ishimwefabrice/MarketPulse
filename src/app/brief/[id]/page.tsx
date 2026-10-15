import { notFound } from "next/navigation";
import { BriefView } from "@/components/BriefView";
import { RunIntelButton } from "@/components/RunIntelButton";
import { getBrief, getBusiness } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BriefPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brief = getBrief(id);
  if (!brief) notFound();
  const business = getBusiness(brief.business_id);

  return (
    <>
      <div className="cta-row" style={{ marginTop: "1.25rem" }}>
        {business ? (
          <a className="btn btn-ghost" href={`/business/${business.id}`}>
            Back to business
          </a>
        ) : null}
        {business ? <RunIntelButton businessId={business.id} /> : null}
      </div>
      <BriefView brief={brief} business={business} />
    </>
  );
}
