import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/store/AddToCartButton";
import ProductGallery from "@/components/store/ProductGallery";
import AIRecommendations from "@/components/store/AIRecommendations";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

interface ProductPageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      nameFr: true, nameEn: true, nameAr: true,
      descriptionFr: true, descriptionEn: true,
      seoTitleFr: true, seoTitleEn: true,
      seoDescriptionFr: true, seoDescriptionEn: true,
      images: { take: 1, select: { url: true } },
      price: true,
    },
  });

  if (!product) return {};

  const name = params.locale === "en" ? product.nameEn : params.locale === "ar" ? product.nameAr : product.nameFr;
  const description = params.locale === "en"
    ? (product.seoDescriptionEn ?? product.descriptionEn)
    : (product.seoDescriptionFr ?? product.descriptionFr);
  const title = params.locale === "en"
    ? (product.seoTitleEn ?? product.nameEn)
    : (product.seoTitleFr ?? product.nameFr);
  const image = product.images[0]?.url;

  return {
    title,
    description: description.slice(0, 160),
    openGraph: {
      title: `${name} — Ziziwatches`,
      description: description.slice(0, 160),
      images: image ? [{ url: image, width: 800, height: 800, alt: name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Ziziwatches`,
      description: description.slice(0, 160),
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const t = await getTranslations({ locale: params.locale, namespace: "product" });

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { position: "asc" } },
      attributes: true,
      category: true,
    },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const name =
    params.locale === "en"
      ? product.nameEn
      : params.locale === "ar"
      ? product.nameAr
      : product.nameFr;

  const description =
    params.locale === "en"
      ? product.descriptionEn
      : params.locale === "ar"
      ? product.descriptionAr
      : product.descriptionFr;

  const seoTitle =
    params.locale === "en"
      ? product.seoTitleEn
      : params.locale === "ar"
      ? product.seoTitleAr
      : product.seoTitleFr;

  // Recommended: same category, different product
  const recommended = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
    take: 3,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <div className="section-padding py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto">
            {/* Images */}
            <ProductGallery images={product.images} productName={name} />

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Breadcrumb */}
              <p className="text-foreground/30 text-xs tracking-wider uppercase mb-4">
                {params.locale === "en"
                  ? product.category.nameEn
                  : params.locale === "ar"
                  ? product.category.nameAr
                  : product.category.nameFr}
              </p>

              {/* Title */}
              <h1 className="luxury-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-4">
                {name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gold text-2xl font-medium">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-foreground/30 text-lg line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Stock badge */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span className="text-foreground/50 text-xs tracking-wider uppercase">
                  {product.stock > 0 ? t("inStock") : t("outOfStock")}
                </span>
              </div>

              {/* Description */}
              <p className="text-foreground/60 leading-relaxed text-sm mb-8">
                {description}
              </p>

              {/* Add to Cart */}
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  nameFr: product.nameFr,
                  nameEn: product.nameEn,
                  nameAr: product.nameAr,
                  price: product.price,
                  image: product.images[0]?.url ?? "",
                  sku: product.sku,
                  coffretPrice: product.coffretPrice,
                }}
                inStock={product.stock > 0}
              />

              {/* Divider */}
              <div className="border-t border-border mt-8 pt-8">
                {/* Specs */}
                <h3 className="text-foreground/80 text-xs tracking-[0.2em] uppercase font-medium mb-4">
                  {t("specifications")}
                </h3>
                <dl className="space-y-3">
                  {product.attributes.map((attr) => {
                    const key =
                      params.locale === "en"
                        ? attr.keyEn
                        : params.locale === "ar"
                        ? attr.keyAr
                        : attr.keyFr;
                    const value =
                      params.locale === "en"
                        ? attr.valueEn
                        : params.locale === "ar"
                        ? attr.valueAr
                        : attr.valueFr;
                    return (
                      <div key={attr.id} className="flex justify-between items-center">
                        <dt className="text-foreground/40 text-xs">{key}</dt>
                        <dd className="text-foreground/70 text-xs font-medium">{value}</dd>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center">
                    <dt className="text-foreground/40 text-xs">{t("sku")}</dt>
                    <dd className="text-foreground/70 text-xs font-mono">{product.sku}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Recommended — AI-powered, falls back to same-category */}
          <AIRecommendations
            productId={product.id}
            locale={params.locale}
            fallback={recommended}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
