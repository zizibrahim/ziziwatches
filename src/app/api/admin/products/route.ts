import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  coffretPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const sku = `ZW-${Date.now().toString().slice(-6)}`;
    const slug = slugify(data.nameFr, { lower: true, strict: true }) + "-" + sku.toLowerCase();

    const product = await prisma.product.create({
      data: {
        slug,
        sku,
        nameFr: data.nameFr,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        coffretPrice: data.coffretPrice,
        stock: data.stock,
        categoryId: data.categoryId,
        featured: data.featured,
        isNew: data.isNew,
        status: data.status,
        images: data.imageUrl
          ? { create: [{ url: data.imageUrl, position: 0 }] }
          : undefined,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
