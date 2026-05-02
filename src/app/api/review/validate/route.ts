import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ valid: false, error: "Token manquant" }, { status: 400 });

  const review = await prisma.review.findUnique({
    where: { token },
    include: {
      order: { select: { orderNumber: true } },
      product: { select: { nameFr: true, images: { take: 1, select: { url: true } } } },
    },
  });

  if (!review) return NextResponse.json({ valid: false, error: "Lien invalide" }, { status: 404 });
  if (review.tokenUsed) return NextResponse.json({ valid: false, error: "Ce lien a déjà été utilisé" }, { status: 410 });
  if (review.status !== "AWAITING") return NextResponse.json({ valid: false, error: "Lien expiré" }, { status: 410 });

  return NextResponse.json({
    valid: true,
    customerName: review.customerName,
    orderNumber: review.order?.orderNumber ?? null,
    productName: review.product?.nameFr ?? null,
    productImage: review.product?.images[0]?.url ?? null,
  });
}
