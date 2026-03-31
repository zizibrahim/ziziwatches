import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCartButton from "@/components/store/AddToCartButton";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: { locale: string; slug: string };
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
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative aspect-square bg-surface overflow-hidden">
                {product.images[0] && (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altFr ?? name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square bg-surface overflow-hidden">
                      <Image
                        src={img.url}
                        alt={img.altFr ?? name}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

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

          {/* Recommended */}
          {recommended.length > 0 && (
            <div className="mt-20 max-w-6xl mx-auto">
              <h2 className="luxury-heading text-2xl font-light text-foreground mb-8">
                {t("recommended")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                {recommended.map((p) => {
                  const pName =
                    params.locale === "en"
                      ? p.nameEn
                      : params.locale === "ar"
                      ? p.nameAr
                      : p.nameFr;
                  return (
                    <a
                      key={p.id}
                      href={`/${params.locale}/shop/${p.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square bg-surface overflow-hidden">
                        {p.images[0] && (
                          <Image
                            src={p.images[0].url}
                            alt={pName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="33vw"
                          />
                        )}
                      </div>
                      <div className="pt-3">
                        <p className="text-foreground/80 text-sm group-hover:text-gold transition-colors luxury-heading">
                          {pName}
                        </p>
                        <p className="text-gold text-xs mt-1">{formatPrice(p.price)}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
