import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PAGE_META: Record<string, { nameFr: string; nameEn: string; nameAr: string }> = {
  montres:  { nameFr: "Montres",  nameEn: "Watches",   nameAr: "ساعات" },
  bijoux:   { nameFr: "Bijoux",   nameEn: "Jewellery", nameAr: "مجوهرات" },
  packs:    { nameFr: "Packs",    nameEn: "Packs",     nameAr: "حزم" },
  cadeaux:  { nameFr: "Cadeaux",  nameEn: "Gifts",     nameAr: "هدايا" },
};

const attributeSchema = z.object({
  keyFr: z.string().min(1),
  keyEn: z.string().min(1),
  keyAr: z.string().min(1),
  valueFr: z.string().min(1),
  valueEn: z.string().min(1),
  valueAr: z.string().min(1),
});

const variantSchema = z.object({
  id: z.string().optional(),
  colorName: z.string().min(1),
  colorHex: z.string().optional(),
  stock: z.number().int().min(0).default(0),
  images: z.array(z.object({ url: z.string() })).default([]),
});

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
  pageType: z.enum(["montres", "bijoux", "packs", "cadeaux"]).optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  imageUrl: z.string().nullable().optional(),
  images: z.array(z.object({ url: z.string(), altFr: z.string().optional() })).optional(),
  variants: z.array(variantSchema).optional(),
  attributes: z.array(attributeSchema).optional(),
  tags: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { imageUrl, images, variants, attributes, tags, pageType, ...productData } = data;

    // Resolve pageType → categoryId
    let resolvedCategoryId: string | undefined;
    if (pageType) {
      const meta = PAGE_META[pageType];
      const cat = await prisma.category.upsert({
        where: { slug: pageType },
        create: { slug: pageType, nameFr: meta.nameFr, nameEn: meta.nameEn, nameAr: meta.nameAr },
        update: {},
      });
      resolvedCategoryId = cat.id;
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: { ...productData, ...(resolvedCategoryId ? { categoryId: resolvedCategoryId } : {}) },
    });

    // Full images array replacement (multi-media upload)
    // Only replace when images array has content — never wipe images with an empty array
    if (images !== undefined && images.length > 0) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      await prisma.productImage.createMany({
        data: images.map((img, i) => ({
          productId: params.id,
          url: img.url,
          altFr: img.altFr ?? null,
          position: i,
        })),
      });
    } else if (imageUrl !== undefined) {
      // Legacy single-image update
      const existing = await prisma.productImage.findFirst({
        where: { productId: params.id },
        orderBy: { position: "asc" },
      });
      if (imageUrl === null) {
        if (existing) await prisma.productImage.delete({ where: { id: existing.id } });
      } else if (existing) {
        await prisma.productImage.update({ where: { id: existing.id }, data: { url: imageUrl } });
      } else {
        await prisma.productImage.create({
          data: { productId: params.id, url: imageUrl, position: 0 },
        });
      }
    }

    // Variants replacement
    if (variants !== undefined) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
      if (variants.length > 0) {
        for (let vi = 0; vi < variants.length; vi++) {
          const v = variants[vi];
          await prisma.productVariant.create({
            data: {
              productId: params.id,
              colorName: v.colorName,
              colorHex: v.colorHex ?? null,
              stock: v.stock,
              position: vi,
              images: v.images.length
                ? { create: v.images.map((img, ii) => ({ url: img.url, position: ii })) }
                : undefined,
            },
          });
        }
      }
    }

    // Attributes replacement
    if (attributes !== undefined) {
      await prisma.productAttribute.deleteMany({ where: { productId: params.id } });
      if (attributes.length > 0) {
        await prisma.productAttribute.createMany({
          data: attributes.map((a) => ({
            productId: params.id,
            keyFr: a.keyFr,
            keyEn: a.keyEn,
            keyAr: a.keyAr,
            valueFr: a.valueFr,
            valueEn: a.valueEn,
            valueAr: a.valueAr,
          })),
        });
      }
    }

    // Tags replacement
    if (tags !== undefined) {
      await prisma.productTag.deleteMany({ where: { productId: params.id } });
      if (tags.length > 0) {
        await prisma.productTag.createMany({
          data: tags.map((tag) => ({ productId: params.id, tag })),
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
