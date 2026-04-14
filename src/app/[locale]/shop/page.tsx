import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDiamondGrid from "@/components/store/ProductDiamondGrid";
import FilmStrip from "@/components/store/FilmStrip";
import SearchBar from "@/components/store/SearchBar";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

interface ShopPageProps {
  params: { locale: string };
  searchParams: { category?: string; sort?: string; q?: string };
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  return {
    title: params.locale === "ar" ? "المتجر" : params.locale === "en" ? "Shop" : "Boutique",
    description:
      params.locale === "en"
        ? "Discover our collection of luxury watches."
        : "Découvrez notre collection de montres de luxe.",
  };
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "shop" });

  const q = searchParams.q?.trim();

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (searchParams.category) where.category = { slug: searchParams.category };
  if (q) {
    where.OR = [
      { nameFr: { contains: q } },
      { nameEn: { contains: q } },
      { nameAr: { contains: q } },
      { descriptionFr: { contains: q } },
    ];
  }

  const sort = searchParams.sort ?? "newest";
  const orderBy = {
    newest: { createdAt: "desc" as const },
    priceAsc: { price: "asc" as const },
    priceDesc: { price: "desc" as const },
    name: { nameFr: "asc" as const },
  }[sort] ?? { createdAt: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: { select: { nameFr: true, nameEn: true, nameAr: true } },
      },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Page Header + Category tabs */}
        <div className="border-b border-border">
          <div className="section-padding pt-10 pb-0">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">Ziziwatches</p>

            {/* Active category name — big title */}
            {(() => {
              const activeCat = categories.find(c => c.slug === searchParams.category);
              const activeLabel = activeCat
                ? (params.locale === "en" ? activeCat.nameEn : params.locale === "ar" ? activeCat.nameAr : activeCat.nameFr)
                : t("title");
              return (
                <h1 className="luxury-heading text-4xl lg:text-5xl font-light text-foreground mb-1">
                  {activeLabel}
                </h1>
              );
            })()}

            {/* Tab switcher */}
            {categories.length > 0 && (
              <div className="flex overflow-x-auto -mb-px">
                <a
                  href={`/${params.locale}/shop${searchParams.q ? `?q=${searchParams.q}` : ""}`}
                  className={`shrink-0 px-5 py-3 text-[11px] tracking-[0.3em] uppercase font-medium border-b-2 transition-colors ${
                    !searchParams.category
                      ? "border-gold text-gold"
                      : "border-transparent text-foreground/40 hover:text-foreground/70"
                  }`}
                >
                  {t("allProducts")}
                </a>
                {categories.map((cat) => {
                  const catName =
                    params.locale === "en" ? cat.nameEn : params.locale === "ar" ? cat.nameAr : cat.nameFr;
                  const href = `/${params.locale}/shop?category=${cat.slug}${searchParams.q ? `&q=${searchParams.q}` : ""}`;
                  return (
                    <a
                      key={cat.id}
                      href={href}
                      className={`shrink-0 px-5 py-3 text-[11px] tracking-[0.3em] uppercase font-medium border-b-2 transition-colors ${
                        searchParams.category === cat.slug
                          ? "border-gold text-gold"
                          : "border-transparent text-foreground/40 hover:text-foreground/70"
                      }`}
                    >
                      {catName}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="section-padding py-10">
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <SearchBar locale={params.locale} />
            <div className="flex items-center gap-3">
              <span className="text-foreground/40 text-xs shrink-0">{t("sortBy")}:</span>
              {(["newest", "priceAsc", "priceDesc"] as const).map((s) => (
                <a
                  key={s}
                  href={`/${params.locale}/shop?${new URLSearchParams({ ...searchParams, sort: s }).toString()}`}
                  className={`text-xs tracking-wider uppercase transition-colors shrink-0 ${
                    sort === s ? "text-gold" : "text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  {t(`sortOptions.${s}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 border border-border bg-surface">
              <p className="text-foreground/30 text-lg mb-2">{t("noResults")}</p>
              {q && (
                <a href={`/${params.locale}/shop`} className="text-gold text-sm hover:underline">
                  Effacer la recherche
                </a>
              )}
            </div>
          ) : (
            <ProductDiamondGrid products={products} />
          )}
        </div>

        {/* Film strip — full width, below the grid */}
        {products.length > 0 && (
          <div className="mt-8">
            <div className="section-padding mb-6">
              <p className="text-gold/50 text-[10px] tracking-[0.4em] uppercase">Défilement — Collection</p>
            </div>
            <FilmStrip products={products} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
