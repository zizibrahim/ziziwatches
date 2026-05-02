import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { z } from "zod";
import { sendWhatsAppMessage, buildReviewMessage } from "@/lib/whatsapp";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status"); // AWAITING | PENDING | APPROVED | REJECTED

  const reviews = await prisma.review.findMany({
    where: status ? { status } : undefined,
    include: {
      order: { select: { orderNumber: true } },
      product: { select: { nameFr: true, images: { take: 1, select: { url: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

const generateSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().min(1).optional(),
  orderId: z.string().optional(),
  productId: z.string().optional(),
  sendWhatsApp: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = generateSchema.parse(body);

    const token = randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const reviewUrl = `${baseUrl}/fr/review?token=${token}`;

    const review = await prisma.review.create({
      data: {
        token,
        customerName: data.customerName,
        customerPhone: data.customerPhone ?? null,
        orderId: data.orderId ?? null,
        productId: data.productId ?? null,
        status: "AWAITING",
      },
    });

    if (data.sendWhatsApp && data.customerPhone) {
      sendWhatsAppMessage(
        data.customerPhone,
        buildReviewMessage(data.customerName, reviewUrl)
      ).catch((e) => console.error("[WhatsApp] Manual generate error:", e));
    }

    return NextResponse.json({ review, reviewUrl });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
