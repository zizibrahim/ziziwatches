import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const category = searchParams.get("category");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const sort = searchParams.get("sort") ?? "newest";

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (featured === "true") where.featured = true;
  if (category) where.category = { slug: category };

  const orderBy = {
    newest: { createdAt: "desc" as const },
    priceAsc: { price: "asc" as const },
    priceDesc: { price: "desc" as const },
    name: { nameFr: "asc" as const },
  }[sort] ?? { createdAt: "desc" as const };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        ...body,
        images: body.images ? { create: body.images } : undefined,
        attributes: body.attributes ? { create: body.attributes } : undefined,
        tags: body.tags ? { create: body.tags.map((t: string) => ({ tag: t })) } : undefined,
      },
      include: { images: true, category: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
