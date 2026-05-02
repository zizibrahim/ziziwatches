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

    // Same category first, fill with others only if needed
    const sameCatProducts = await prisma.product.findMany({
      where: { status: "ACTIVE", id: { not: currentProductId }, categoryId: currentProduct.categoryId },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    });

    const otherProducts =
      sameCatProducts.length < 4
        ? await prisma.product.findMany({
            where: {
              status: "ACTIVE",
              id: { notIn: [currentProductId, ...sameCatProducts.map((p) => p.id)] },
            },
            include: { images: { take: 1, orderBy: { position: "asc" } } },
          })
        : [];

    const allProducts = [...sameCatProducts, ...otherProducts];

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

    // Preserve same-category priority in the final result
    const recommendedIds: string[] = result.recommendedIds ?? [];
    const sameCatFirst = [
      ...recommendedIds.filter((id) => sameCatProducts.some((p) => p.id === id)),
      ...recommendedIds.filter((id) => !sameCatProducts.some((p) => p.id === id)),
    ].slice(0, 4);

    const recommended = await prisma.product.findMany({
      where: { id: { in: sameCatFirst } },
      include: { images: { take: 1, orderBy: { position: "asc" } } },
    });

    return NextResponse.json({ recommendations: recommended });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ recommendations: [] });
  }
}
