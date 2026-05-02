import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("n")?.trim();

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing order number" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { orderNumber },
    include: { items: { include: { product: { select: { images: { take: 1, orderBy: { position: "asc" } } } } } } },
  });

  if (!order) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const shipping = (() => {
    try { return JSON.parse(order.shippingAddress) as Record<string, string>; } catch { return {}; }
  })();

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    city: shipping.city ?? null,
    firstName: shipping.firstName ?? null,
    items: order.items.map((i) => ({
      name: i.productName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      packaging: i.packaging,
      image: i.product?.images?.[0]?.url ?? null,
    })),
  });
}
