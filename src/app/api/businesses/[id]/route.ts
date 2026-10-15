import { NextResponse } from "next/server";
import { getBusiness, listBriefsForBusiness } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const business = getBusiness(id);
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }
  const briefs = listBriefsForBusiness(id);
  return NextResponse.json({ business, briefs });
}
