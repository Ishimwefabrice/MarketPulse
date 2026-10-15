import { NextResponse } from "next/server";
import { getBrief, getBusiness } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const brief = getBrief(id);
  if (!brief) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }
  const business = getBusiness(brief.business_id);
  return NextResponse.json({ brief, business });
}
