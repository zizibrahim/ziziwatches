import { NextRequest, NextResponse } from "next/server";
import { generateProductContent } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nameEn, nameFr, category, specs } = body;

    if (!nameEn || !nameFr || !category) {
      return NextResponse.json({ error: "nameEn, nameFr, category required" }, { status: 400 });
    }

    const content = await generateProductContent({ nameEn, nameFr, category, specs: specs ?? [] });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
