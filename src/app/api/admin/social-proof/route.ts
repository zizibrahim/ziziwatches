import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.socialProofImage.findMany({
    orderBy: { position: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const { url, platform = "whatsapp", caption, position = 0 } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });
  const image = await prisma.socialProofImage.create({
    data: { url, platform, caption: caption ?? null, position },
  });
  return NextResponse.json(image);
}
