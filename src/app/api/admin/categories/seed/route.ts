import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_CATEGORIES = [
  {
    slug: "montres-homme",
    nameFr: "Montres Homme",
    nameEn: "Men's Watches",
    nameAr: "ساعات رجالية",
  },
  {
    slug: "montres-femme",
    nameFr: "Montres Femme",
    nameEn: "Women's Watches",
    nameAr: "ساعات نسائية",
  },
  {
    slug: "accessoires",
    nameFr: "Accessoires",
    nameEn: "Accessories",
    nameAr: "إكسسوارات",
  },
  {
    slug: "packs",
    nameFr: "Packs",
    nameEn: "Packs",
    nameAr: "حزم",
  },
  {
    slug: "cadeaux",
    nameFr: "Cadeaux",
    nameEn: "Gifts",
    nameAr: "هدايا",
  },
];

export async function POST() {
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  return NextResponse.json({ ok: true, count: DEFAULT_CATEGORIES.length });
}
