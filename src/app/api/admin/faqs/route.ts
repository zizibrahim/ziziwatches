import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  questionFr: z.string().min(1),
  questionEn: z.string().min(1),
  questionAr: z.string().min(1),
  answerFr: z.string().min(1),
  answerEn: z.string().min(1),
  answerAr: z.string().min(1),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

export async function GET() {
  const faqs = await prisma.$queryRaw<any[]>`
    SELECT * FROM faqs ORDER BY "order" ASC
  `;
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const published = data.published ? 1 : 0;

    await prisma.$executeRaw`
      INSERT INTO faqs (id, questionFr, questionEn, questionAr, answerFr, answerEn, answerAr, "order", published, createdAt, updatedAt)
      VALUES (${id}, ${data.questionFr}, ${data.questionEn}, ${data.questionAr}, ${data.answerFr}, ${data.answerEn}, ${data.answerAr}, ${data.order}, ${published}, ${now}, ${now})
    `;

    const faq = await prisma.$queryRaw<any[]>`SELECT * FROM faqs WHERE id = ${id}`;
    return NextResponse.json(faq[0], { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
