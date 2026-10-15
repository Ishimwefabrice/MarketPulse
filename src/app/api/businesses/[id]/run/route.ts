import { NextResponse } from "next/server";
import { runIntelPipeline } from "@/lib/agent";
import { getBusiness, saveBrief } from "@/lib/db";

export const maxDuration = 120;

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const business = getBusiness(id);
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  try {
    const payload = await runIntelPipeline(business);
    const brief = saveBrief(business.id, payload);
    return NextResponse.json({ brief });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Intel run failed";
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
