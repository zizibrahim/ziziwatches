import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  slug: z.string().min(1),
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
});

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { nameFr: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà. Choisissez un slug différent." }, { status: 409 });
    }
    const category = await prisma.category.create({ data });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
