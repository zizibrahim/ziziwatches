import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendWhatsAppMessage, buildReviewMessage } from "@/lib/whatsapp";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Fetch current order to detect status transition
    const current = await prisma.order.findUnique({
      where: { id: params.id },
      include: { reviews: { select: { id: true } } },
    });
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: { items: true },
    });

    // When transitioning to DELIVERED: create review token + send WhatsApp
    const becomingDelivered =
      data.status === "DELIVERED" &&
      current.status !== "DELIVERED" &&
      current.reviews.length === 0; // only once per order

    if (becomingDelivered) {
      const token = randomBytes(32).toString("hex");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      const reviewUrl = `${baseUrl}/fr/review?token=${token}`;

      const shipping = JSON.parse(current.shippingAddress) as {
        firstName: string;
        lastName: string;
        phone: string;
      };
      const customerName = `${shipping.firstName} ${shipping.lastName}`;
      const customerPhone = shipping.phone || current.guestPhone || "";

      await prisma.review.create({
        data: {
          token,
          orderId: current.id,
          customerName,
          customerPhone,
          status: "AWAITING",
        },
      });

      if (customerPhone) {
        // Non-blocking
        sendWhatsAppMessage(customerPhone, buildReviewMessage(customerName, reviewUrl)).catch(
          (e) => console.error("[WhatsApp] Delivery trigger error:", e)
        );
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
