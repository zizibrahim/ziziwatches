import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, rating, comment } = schema.parse(body);

    const review = await prisma.review.findUnique({ where: { token } });

    if (!review) return NextResponse.json({ error: "Lien invalide" }, { status: 404 });
    if (review.tokenUsed || review.status !== "AWAITING")
      return NextResponse.json({ error: "Ce lien a déjà été utilisé" }, { status: 410 });

    await prisma.review.update({
      where: { token },
      data: {
        rating,
        comment: comment ?? null,
        tokenUsed: true,
        status: "PENDING",
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
