"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  images: { url: string; altFr: string | null }[];
}

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("home.featured");
  const tShop = useTranslations("shop");
  const locale = useLocale();

  const getName = (p: Product) => {
    if (locale === "en") return p.nameEn;
    if (locale === "ar") return p.nameAr;
    return p.nameFr;
  };

  return (
    <section className="section-padding py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">
            Collection
          </p>
          <h2 className="luxury-heading text-4xl lg:text-5xl font-light text-foreground">
            {t("title")}
          </h2>
        </div>
        <Link
          href={`/${locale}/shop`}
          className="hidden sm:block text-xs tracking-[0.2em] uppercase text-foreground/50 hover:text-gold transition-colors border-b border-white/20 hover:border-gold pb-1"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <Link href={`/${locale}/shop/${product.slug}`} className="group block">
              {/* Image */}
              <div className="relative aspect-square bg-surface overflow-hidden">
                {product.images[0] && (
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altFr ?? product.nameFr}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/40 transition-colors duration-300" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {product.isNew && (
                    <span className="bg-gold text-obsidian text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase">
                      {tShop("new")}
                    </span>
                  )}
                  {product.compareAtPrice && (
                    <span className="bg-white/10 text-foreground text-[10px] font-medium px-2 py-0.5 tracking-wider uppercase">
                      {tShop("sale")}
                    </span>
                  )}
                </div>

                {/* Quick view hover overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="btn-gold text-center text-[11px] w-full py-2">
                    {tShop("addToCart")}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pt-4 pb-2">
                <h3 className="luxury-heading text-lg font-light text-foreground group-hover:text-gold transition-colors duration-300">
                  {getName(product)}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gold text-sm font-medium">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-foreground/30 text-xs line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="sm:hidden mt-8 text-center">
        <Link href={`/${locale}/shop`} className="btn-outline inline-block">
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
