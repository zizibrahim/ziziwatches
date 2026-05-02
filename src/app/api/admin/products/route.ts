import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
import slugify from "slugify";

const PAGE_META: Record<string, { nameFr: string; nameEn: string; nameAr: string }> = {
  montres:  { nameFr: "Montres",  nameEn: "Watches",   nameAr: "ساعات" },
  bijoux:   { nameFr: "Bijoux",   nameEn: "Jewellery", nameAr: "مجوهرات" },
  packs:    { nameFr: "Packs",    nameEn: "Packs",     nameAr: "حزم" },
  cadeaux:  { nameFr: "Cadeaux",  nameEn: "Gifts",     nameAr: "هدايا" },
};

const attributeSchema = z.object({
  keyFr: z.string().min(1), keyEn: z.string().min(1), keyAr: z.string().min(1),
  valueFr: z.string().min(1), valueEn: z.string().min(1), valueAr: z.string().min(1),
});

const variantSchema = z.object({
  colorName: z.string().min(1),
  colorHex: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.object({ url: z.string() })).default([]),
});

const schema = z.object({
  nameFr: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().optional(),
  descriptionFr: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional().nullable(),
  coffretPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  pageType: z.enum(["montres", "bijoux", "packs", "cadeaux"]),
  images: z.array(z.object({ url: z.string(), altFr: z.string().optional() })).optional(),
  variants: z.array(variantSchema).optional(),
  attributes: z.array(attributeSchema).optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Auto-create category if it doesn't exist
    const meta = PAGE_META[data.pageType];
    const category = await prisma.category.upsert({
      where: { slug: data.pageType },
      create: { slug: data.pageType, nameFr: meta.nameFr, nameEn: meta.nameEn, nameAr: meta.nameAr },
      update: {},
    });

    const sku = `ZW-${Date.now().toString().slice(-6)}`;
    const slug = slugify(data.nameFr, { lower: true, strict: true }) + "-" + sku.toLowerCase();

    const product = await prisma.product.create({
      data: {
        slug,
        sku,
        nameFr: data.nameFr,
        nameEn: data.nameEn,
        nameAr: data.nameAr || data.nameFr,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        coffretPrice: data.coffretPrice,
        stock: data.stock,
        categoryId: category.id,
        featured: data.featured,
        isNew: data.isNew,
        status: data.status,
        images: data.images?.length
          ? { create: data.images.map((img, i) => ({ url: img.url, altFr: img.altFr ?? null, position: i })) }
          : undefined,
        variants: data.variants?.length
          ? {
              create: data.variants.map((v, vi) => ({
                colorName: v.colorName,
                colorHex: v.colorHex ?? null,
                stock: v.stock,
                position: vi,
                images: v.images.length
                  ? { create: v.images.map((img, ii) => ({ url: img.url, position: ii })) }
                  : undefined,
              })),
            }
          : undefined,
        attributes: data.attributes?.length
          ? { create: data.attributes.map((a) => ({ keyFr: a.keyFr, keyEn: a.keyEn, keyAr: a.keyAr, valueFr: a.valueFr, valueEn: a.valueEn, valueAr: a.valueAr })) }
          : undefined,
      },
    });

    if (data.tags?.length) {
      await prisma.productTag.createMany({
        data: data.tags.map((tag) => ({ productId: product.id, tag })),
      });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
