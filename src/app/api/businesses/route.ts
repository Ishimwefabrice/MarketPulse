import { NextResponse } from "next/server";
import { z } from "zod";
import { createBusiness, listBusinesses } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  niche: z.string().min(1).max(160),
  city: z.string().min(1).max(120),
  competitors: z.string().max(500).optional(),
  goals: z
    .array(z.enum(["traffic", "pricing", "content"]))
    .min(1)
    .max(3),
});

export async function GET() {
  return NextResponse.json({ businesses: listBusinesses() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const business = createBusiness(parsed);
    return NextResponse.json({ business }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: err.flatten() },
        { status: 400 },
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }
}
