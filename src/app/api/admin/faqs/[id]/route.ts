import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const VALID_CATEGORIES = ["general", "watches", "jewellery", "shipping", "orders", "payment", "account"];

const schema = z.object({
  questionFr: z.string().min(1).optional(),
  questionEn: z.string().min(1).optional(),
  questionAr: z.string().min(1).optional(),
  answerFr: z.string().min(1).optional(),
  answerEn: z.string().min(1).optional(),
  answerAr: z.string().min(1).optional(),
  category: z.string().refine((v) => VALID_CATEGORIES.includes(v)).optional(),
  popular: z.boolean().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const now = new Date().toISOString();

    const existing = await prisma.$queryRaw<any[]>`
      SELECT * FROM faqs WHERE id = ${params.id}
    `;
    if (!existing.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const current = existing[0];

    const questionFr = data.questionFr ?? current.questionFr;
    const questionEn = data.questionEn ?? current.questionEn;
    const questionAr = data.questionAr ?? current.questionAr;
    const answerFr = data.answerFr ?? current.answerFr;
    const answerEn = data.answerEn ?? current.answerEn;
    const answerAr = data.answerAr ?? current.answerAr;
    const category = data.category ?? current.category ?? "general";
    const popular = data.popular !== undefined ? (data.popular ? 1 : 0) : current.popular;
    const order = data.order ?? current.order;
    const published = data.published !== undefined
      ? (data.published ? 1 : 0)
      : current.published;

    await prisma.$executeRaw`
      UPDATE faqs
      SET questionFr = ${questionFr},
          questionEn = ${questionEn},
          questionAr = ${questionAr},
          answerFr   = ${answerFr},
          answerEn   = ${answerEn},
          answerAr   = ${answerAr},
          category   = ${category},
          popular    = ${popular},
          "order"    = ${order},
          published  = ${published},
          updatedAt  = ${now}
      WHERE id = ${params.id}
    `;

    const updated = await prisma.$queryRaw<any[]>`SELECT * FROM faqs WHERE id = ${params.id}`;
    return NextResponse.json(updated[0]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.$executeRaw`DELETE FROM faqs WHERE id = ${params.id}`;
  return NextResponse.json({ ok: true });
}
