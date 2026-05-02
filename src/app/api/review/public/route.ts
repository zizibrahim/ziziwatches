import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";

const schema = z.object({
  customerName: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
  productId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.review.create({
      data: {
        token: randomBytes(24).toString("hex"),
        tokenUsed: true,
        customerName: data.customerName,
        city: data.city,
        rating: data.rating,
        comment: data.comment,
        status: "PENDING",
        submittedAt: new Date(),
        ...(data.productId ? { productId: data.productId } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
