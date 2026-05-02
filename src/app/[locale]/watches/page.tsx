import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDiamondGrid from "@/components/store/ProductDiamondGrid";
import SearchBar from "@/components/store/SearchBar";
import SubCategoryCircles from "@/components/store/SubCategoryCircles";
import Image from "next/image";
import MarqueeSection from "@/components/home/MarqueeSection";
import type { Metadata } from "next";

interface PageProps {
  params: { locale: string };
  searchParams: { sort?: string; q?: string; gender?: string };
}

export const metadata: Metadata = {
  title: "Montres — Ziziwatches",
  description: "Découvrez notre collection complète de montres homme et femme.",
};

const ORDER_BY = {
  newest:   { createdAt: "desc" as const },
  priceAsc: { price:     "asc"  as const },
  priceDesc:{ price:     "desc" as const },
};
const SORT_LABELS = { newest: "Nouveautés", priceAsc: "Prix ↑", priceDesc: "Prix ↓" };

export default async function WatchesPage({ params, searchParams }: PageProps) {
  const sort   = searchParams.sort ?? "newest";
  const q      = searchParams.q?.trim();
  const gender = searchParams.gender;

  const slugFilter = gender === "homme"
    ? "montres-homme"
    : gender === "femme"
    ? "montres-femme"
    : undefined;

  const where: Record<string, unknown> = {
    status: "ACTIVE",
    category: slugFilter
      ? { slug: slugFilter }
      : { slug: { in: ["montres-homme", "montres-femme"] } },
  };
  if (q) where.OR = [{ nameFr: { contains: q } }, { nameEn: { contains: q } }];

  const products = await prisma.product.findMany({
    where,
    include: {
      images:   { orderBy: { position: "asc" }, take: 1 },
      category: { select: { nameFr: true, nameEn: true, nameAr: true } },
    },
    orderBy: ORDER_BY[sort as keyof typeof ORDER_BY] ?? ORDER_BY.newest,
    take: 100,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen">

        <div className="relative h-72 sm:h-80 lg:h-[420px] flex items-center justify-center">
          <Image src="/back1.png" alt="Montres" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center px-6 pt-16">
            <p className="text-white/50 text-[10px] tracking-[0.5em] uppercase mb-4">Ziziwatches</p>
            <h1 className="luxury-heading text-5xl sm:text-6xl lg:text-7xl font-light text-white tracking-wide">Montres</h1>
          </div>
        </div>

        <MarqueeSection />

        <SubCategoryCircles circles={[
          { label: "Montres Homme",   href: `/${params.locale}/watches?gender=homme`,   image: "/menwatche.png" },
          { label: "Montres Femme",   href: `/${params.locale}/watches?gender=femme`,   image: "/womenwatche.png" },
          { label: "Nouveautés",      href: `/${params.locale}/watches?sort=newest`,    image: "/back2.png" },
          { label: "Bestsellers",     href: `/${params.locale}/watches?sort=priceDesc`, image: "/pic3.png" },
        ]} />

        <div className="section-padding py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <SearchBar locale={params.locale} />
            <div className="flex items-center gap-3">
              <span className="text-foreground/40 text-xs shrink-0">Trier par :</span>
              {(Object.keys(SORT_LABELS) as (keyof typeof SORT_LABELS)[]).map((s) => (
                <a
                  key={s}
                  href={`/${params.locale}/watches?sort=${s}${gender ? `&gender=${gender}` : ""}${q ? `&q=${q}` : ""}`}
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
            <div className="text-center py-24 border border-border bg-surface">
              <p className="text-foreground/30 text-lg">Aucun produit trouvé.</p>
            </div>
          ) : (
            <ProductDiamondGrid products={products} />
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}
