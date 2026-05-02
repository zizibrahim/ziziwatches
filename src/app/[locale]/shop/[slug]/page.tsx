import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/store/AddToCartButton";
import ProductGallery from "@/components/store/ProductGallery";
import AIRecommendations from "@/components/store/AIRecommendations";
import ProductVariantSelector from "@/components/store/ProductVariantSelector";
import ProductReviews from "@/components/store/ProductReviews";
import LeaveReviewSection from "@/components/store/LeaveReviewSection";
import StandsForSection from "@/components/home/StandsForSection";
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
      variants: {
        orderBy: { position: "asc" },
        include: { images: { orderBy: { position: "asc" } } },
      },
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

  const productReviews = await prisma.review.findMany({
    where: { productId: product.id, status: "APPROVED" },
    orderBy: { approvedAt: "desc" },
    take: 12,
  });

  // Recommended: same category first, fill up from any category if needed
  const sameCat = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    include: { images: { take: 1, orderBy: { position: "asc" } } },
    take: 4,
  });

  const recommended =
    sameCat.length >= 4
      ? sameCat
      : [
          ...sameCat,
          ...(await prisma.product.findMany({
            where: {
              id: { notIn: [product.id, ...sameCat.map((p) => p.id)] },
              status: "ACTIVE",
            },
            include: { images: { take: 1, orderBy: { position: "asc" } } },
            take: 4 - sameCat.length,
            orderBy: { createdAt: "desc" },
          })),
        ];

  const categoryName = product.category
    ? params.locale === "en" ? product.category.nameEn
    : params.locale === "ar" ? product.category.nameAr
    : product.category.nameFr
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* ── Breadcrumb ── */}
        <div className="border-b border-border/50 bg-background">
          <div className="section-padding py-3 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/35 pt-20 lg:pt-24">
            <a href={`/${params.locale}`} className="hover:text-foreground/60 transition-colors">Accueil</a>
            <span>/</span>
            <a href={`/${params.locale}/shop`} className="hover:text-foreground/60 transition-colors">Boutique</a>
            {categoryName && <><span>/</span><span className="text-foreground/55">{categoryName}</span></>}
            <span>/</span>
            <span className="text-foreground/70">{name}</span>
          </div>
        </div>

        {/* ── Main product grid ── */}
        <div className="section-padding py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 xl:gap-16 max-w-7xl mx-auto">
            <ProductVariantSelector
              productId={product.id}
              productSlug={product.slug}
              name={name}
              description={description}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              nameFr={product.nameFr}
              nameEn={product.nameEn}
              nameAr={product.nameAr}
              sku={product.sku}
              coffretPrice={product.coffretPrice}
              stock={product.stock}
              baseImages={product.images.map((img) => ({ url: img.url, altFr: img.altFr }))}
              variants={product.variants.map((v) => ({
                id: v.id,
                colorName: v.colorName,
                colorHex: v.colorHex,
                stock: v.stock,
                images: v.images.map((img) => ({ url: img.url })),
              }))}
              categoryName={categoryName}
              inStockLabel={t("inStock")}
              outOfStockLabel={t("outOfStock")}
              addToCartLabel={t("addToCart")}
              specsLabel={t("specifications")}
              skuLabel={t("sku")}
              attributes={product.attributes.map((attr) => ({
                key: params.locale === "en" ? attr.keyEn : params.locale === "ar" ? attr.keyAr : attr.keyFr,
                value: params.locale === "en" ? attr.valueEn : params.locale === "ar" ? attr.valueAr : attr.valueFr,
              }))}
            />
          </div>
        </div>

        {/* ── Détails Techniques ── */}
        {product.attributes.length > 0 && (
          <div className="border-t border-border/40 section-padding py-14 lg:py-20">
            <div className="max-w-7xl mx-auto">
              {/* Heading */}
              <div className="flex items-center gap-5 mb-12">
                <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-olive whitespace-nowrap">
                  Détails Techniques
                </h2>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Specs table */}
                <div>
                  <dl className="divide-y divide-border/40">
                    {product.attributes.map((attr, i) => {
                      const key = params.locale === "en" ? attr.keyEn : params.locale === "ar" ? attr.keyAr : attr.keyFr;
                      const val = params.locale === "en" ? attr.valueEn : params.locale === "ar" ? attr.valueAr : attr.valueFr;
                      return (
                        <div key={i} className="grid grid-cols-2 gap-8 py-4">
                          <dt className="text-sm font-semibold text-foreground/70">{key}</dt>
                          <dd className="text-sm text-foreground/50 text-center">{val}</dd>
                        </div>
                      );
                    })}
                  </dl>

                </div>

                {/* Product image */}
                {product.images[0] && (
                  <div className="flex justify-center">
                    <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                      <img
                        src={product.images[0].url}
                        alt={name}
                        className="w-full h-full object-contain drop-shadow-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <ProductReviews reviews={productReviews.map(r => ({
          id: r.id,
          customerName: r.customerName,
          city: r.city,
          rating: r.rating ?? 0,
          comment: r.comment,
          approvedAt: r.approvedAt?.toISOString() ?? r.createdAt.toISOString(),
        }))} />

        {/* ── Leave a Review ── */}
        <LeaveReviewSection productId={product.id} />

        {/* ── Recommended ── */}
        <AIRecommendations
          productId={product.id}
          locale={params.locale}
          fallback={recommended}
        />

        {/* ── Engagements ── */}
        <StandsForSection />
      </main>
      <Footer />
    </>
  );
}
