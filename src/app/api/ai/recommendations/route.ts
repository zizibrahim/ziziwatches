import { NextRequest, NextResponse } from "next/server";
import { generateRecommendations } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { currentProductId } = await req.json();

    const currentProduct = await prisma.product.findUnique({
      where: { id: currentProductId },
      include: { category: true, tags: true },
    });

    if (!currentProduct) {
      return NextResponse.json({ recommendations: [] });
    }

    const allProducts = await prisma.product.findMany({
      where: { status: "ACTIVE", id: { not: currentProductId } },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    });

    const result = await generateRecommendations({
      currentProduct: {
        name: currentProduct.nameFr,
        category: currentProduct.category?.nameFr ?? "",
        tags: currentProduct.tags.map((t) => t.tag),
      },
      availableProducts: allProducts.map((p) => ({
        id: p.id,
        name: p.nameFr,
        category: p.categoryId ?? "",
        price: p.price,
      })),
    });

    const recommended = await prisma.product.findMany({
      where: { id: { in: result.recommendedIds ?? [] } },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    });

    return NextResponse.json({ recommendations: recommended });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ recommendations: [] });
  }
}
