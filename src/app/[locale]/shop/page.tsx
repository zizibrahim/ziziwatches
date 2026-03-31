import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/store/ProductCard";
import { getTranslations } from "next-intl/server";

interface ShopPageProps {
  params: { locale: string };
  searchParams: { category?: string; sort?: string; page?: string };
}

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "shop" });

  const where: Record<string, unknown> = { status: "ACTIVE" };
  if (searchParams.category) {
    where.category = { slug: searchParams.category };
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
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">
            Ziziwatches
          </p>
          <h1 className="luxury-heading text-4xl lg:text-5xl font-light text-foreground">
            {t("title")}
          </h1>
          <p className="text-foreground/40 text-sm mt-2">{t("subtitle")}</p>
        </div>

        <div className="section-padding py-10">
          {/* Filters bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`/${params.locale}/shop`}
                className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
                  !searchParams.category
                    ? "border-gold text-gold"
                    : "border-border text-foreground/50 hover:border-white/30 hover:text-foreground/70"
                }`}
              >
                {t("allProducts")}
              </a>
              {categories.map((cat) => {
                const catName =
                  params.locale === "en"
                    ? cat.nameEn
                    : params.locale === "ar"
                    ? cat.nameAr
                    : cat.nameFr;
                return (
                  <a
                    key={cat.id}
                    href={`/${params.locale}/shop?category=${cat.slug}`}
                    className={`text-xs tracking-wider uppercase px-4 py-2 border transition-colors ${
                      searchParams.category === cat.slug
                        ? "border-gold text-gold"
                        : "border-border text-foreground/50 hover:border-white/30 hover:text-foreground/70"
                    }`}
                  >
                    {catName}
                  </a>
                );
              })}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-foreground/40 text-xs">{t("sortBy")}:</span>
              {(["newest", "priceAsc", "priceDesc"] as const).map((s) => (
                <a
                  key={s}
                  href={`/${params.locale}/shop?${new URLSearchParams({ ...searchParams, sort: s }).toString()}`}
                  className={`text-xs tracking-wider uppercase transition-colors ${
                    sort === s ? "text-gold" : "text-foreground/40 hover:text-foreground/60"
                  }`}
                >
                  {t(`sortOptions.${s}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Count */}
          <p className="text-foreground/30 text-xs mb-6">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground/30 text-lg">{t("noResults")}</p>
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
