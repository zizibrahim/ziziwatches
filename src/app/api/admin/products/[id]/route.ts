import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nameFr: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  nameAr: z.string().min(1).optional(),
  descriptionFr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  coffretPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { imageUrl, ...productData } = data;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: productData,
    });

    // Update image URL if provided
    if (imageUrl !== undefined) {
      const existing = await prisma.productImage.findFirst({
        where: { productId: params.id },
        orderBy: { position: "asc" },
      });
      if (imageUrl === null) {
        // remove first image
        if (existing) await prisma.productImage.delete({ where: { id: existing.id } });
      } else if (existing) {
        await prisma.productImage.update({ where: { id: existing.id }, data: { url: imageUrl } });
      } else {
        await prisma.productImage.create({
          data: { productId: params.id, url: imageUrl, position: 0 },
        });
      }
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.product.update({
      where: { id: params.id },
      data: { status: "ARCHIVED" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
