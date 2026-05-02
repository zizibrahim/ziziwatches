import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDiamondGrid from "@/components/store/ProductDiamondGrid";
import SearchBar from "@/components/store/SearchBar";
import SubCategoryCircles from "@/components/store/SubCategoryCircles";
import MarqueeSection from "@/components/home/MarqueeSection";
import Image from "next/image";
import BestsellerEmpty from "@/components/store/BestsellerEmpty";
import type { Metadata } from "next";

interface PageProps {
  params: { locale: string };
  searchParams: { sort?: string; q?: string };
}

export const metadata: Metadata = {
  title: "Bestsellers Pack — Ziziwatches",
  description: "Découvrez nos packs les plus populaires.",
};

export const dynamic = "force-dynamic";

const ORDER_BY = {
  newest:   { createdAt: "desc" as const },
  priceAsc: { price:     "asc"  as const },
  priceDesc:{ price:     "desc" as const },
};
const SORT_LABELS = { newest: "Nouveautés", priceAsc: "Prix ↑", priceDesc: "Prix ↓" };

export default async function BestsellersPackPage({ params, searchParams }: PageProps) {
  const sort = searchParams.sort ?? "newest";
  const q    = searchParams.q?.trim();

  const where: Record<string, unknown> = {
    isBestseller: true,
    status: "ACTIVE",
    category: { slug: "packs" },
  };
  if (q) where.OR = [{ nameFr: { contains: q } }, { nameEn: { contains: q } }];

  const products = await prisma.product.findMany({
    where,
    include: {
      images:   { orderBy: { position: "asc" }, take: 1 },
      category: { select: { nameFr: true, nameEn: true, nameAr: true } },
    },
    orderBy: ORDER_BY[sort as keyof typeof ORDER_BY] ?? ORDER_BY.newest,
  });

  const locale = params.locale;

  return (
    <>
      <Header />
      <main className="min-h-screen">

        <div className="relative h-72 sm:h-80 lg:h-[420px] flex items-center justify-center">
          <Image src="/pack.png" alt="Bestsellers Pack" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-6 pt-16">
            <p className="text-white/50 text-[10px] tracking-[0.5em] uppercase mb-4">Ziziwatches</p>
            <h1 className="luxury-heading text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-wide">
              Bestsellers
            </h1>
            <p className="text-white/40 text-sm tracking-[0.4em] mt-3 uppercase">
              {locale === "en" ? "Best-selling packs" : "Nos packs les plus populaires"}
            </p>
          </div>
        </div>

        <MarqueeSection />

        <SubCategoryCircles circles={[
          { label: "Homme",       href: `/${locale}/bestsellers/men`,       image: "/menwatche.png" },
          { label: "Femme",       href: `/${locale}/bestsellers/women`,     image: "/womenwatche.png" },
          { label: "Pack",        href: `/${locale}/bestsellers/pack`,      image: "/pack.png" },
          { label: "Accessoires", href: `/${locale}/bestsellers/accessoires`, image: "/bijouxwomen.png" },
          { label: "Cadeaux",     href: `/${locale}/gifts`,                 image: "/gift.png" },
        ]} />

        <div className="section-padding py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <SearchBar locale={locale} />
            <div className="flex items-center gap-3">
              <span className="text-foreground/40 text-xs shrink-0">Trier par :</span>
              {(Object.keys(SORT_LABELS) as (keyof typeof SORT_LABELS)[]).map((s) => (
                <a
                  key={s}
                  href={`/${locale}/bestsellers/pack?sort=${s}${q ? `&q=${q}` : ""}`}
                  className={`text-xs tracking-wider uppercase transition-colors shrink-0 ${
                    sort === s ? "text-gold" : "text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  {SORT_LABELS[s]}
                </a>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <BestsellerEmpty label="Aucun bestseller pack pour l'instant" />
          ) : (
            <ProductDiamondGrid products={products} />
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
