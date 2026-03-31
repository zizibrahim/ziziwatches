import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const OrderSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().min(5),
  city: z.string().min(2),
  wilaya: z.string().min(2),
  notes: z.string().optional(),
  locale: z.string().default("fr"),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = OrderSchema.parse(body);

    // Fetch product prices from DB (never trust client prices)
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products not found" },
        { status: 400 }
      );
    }

    const orderItems = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.nameFr,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0);
    const total = subtotal; // Free shipping

    const shippingAddress = JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      street: data.street,
      city: data.city,
      wilaya: data.wilaya,
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        guestPhone: data.phone,
        guestEmail: data.email || null,
        status: "PENDING",
        paymentMethod: "COD",
        subtotal,
        shippingCost: 0,
        total,
        shippingAddress,
        notes: data.notes,
        locale: data.locale,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const where: Record<string, unknown> = {};
  if (phone) where.guestPhone = phone;

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
