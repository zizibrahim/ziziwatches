import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/store/ProductCard";
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
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { nameEn: "asc" } }),
  ]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24">
        {/* Page Header */}
        <div className="section-padding py-12 border-b border-border">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Ziziwatches</p>
          <h1 className="luxury-heading text-4xl lg:text-5xl font-light text-foreground">
            {t("title")}
          </h1>
          <p className="text-foreground/40 text-sm mt-2">{t("subtitle")}</p>
        </div>

        <div className="section-padding py-10">
          {/* Filters + Search bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Category filters — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0">
              <a
                href={`/${params.locale}/shop${searchParams.q ? `?q=${searchParams.q}` : ""}`}
                className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
                  !searchParams.category
                    ? "border-gold text-gold"
                    : "border-border text-foreground/50 hover:border-gold/30 hover:text-foreground/70"
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
                    className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
                      searchParams.category === cat.slug
                        ? "border-gold text-gold"
                        : "border-border text-foreground/50 hover:border-gold/30 hover:text-foreground/70"
                    }`}
                  >
                    {catName}
                  </a>
                );
              })}
            </div>

            {/* Search */}
            <SearchBar locale={params.locale} />
          </div>

          {/* Sort + Count row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <p className="text-foreground/30 text-xs">
              {q && (
                <span className="text-gold mr-2">&ldquo;{q}&rdquo; —</span>
              )}
              {products.length} produit{products.length !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-3 overflow-x-auto pb-0.5">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
