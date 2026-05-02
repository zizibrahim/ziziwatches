import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { z } from "zod";

const OrderSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().min(5),
  city: z.string().min(2),
  wilaya: z.string().optional().default(""),
  notes: z.string().optional(),
  locale: z.string().default("fr"),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      packaging: z.enum(["simple", "coffret"]).default("simple"),
      variantColor: z.string().optional().nullable(),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = OrderSchema.parse(body);

    // Fetch product prices from DB (never trust client prices)
    const productIds = Array.from(new Set(data.items.map((i) => i.productId)));
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
      const packagingPrice =
        item.packaging === "coffret" ? (product.coffretPrice ?? 0) : 0;
      const unitPrice = product.price + packagingPrice;
      return {
        productId: item.productId,
        productName: product.nameFr,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice,
        total: unitPrice * item.quantity,
        packaging: item.packaging,
        packagingPrice,
        variantColor: item.variantColor ?? null,
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

    // Send confirmation email (non-blocking)
    if (data.email) {
      sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        items: orderItems.map((i) => ({ name: i.productName, quantity: i.quantity, price: i.total })),
        total,
        address: `${data.street}, ${data.city}, ${data.wilaya}`,
        locale: data.locale,
      }).catch(console.error);
    }

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
