"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import ProductDiamondGrid from "@/components/store/ProductDiamondGrid";
import FilmStrip from "@/components/store/FilmStrip";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  stock: number;
  sku: string;
  images: { url: string; altFr: string | null }[];
  category?: { nameFr: string; nameEn: string; nameAr: string } | null;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useTranslations("home.featured");
  const locale = useLocale();

  return (
    <section className="py-20">
      {/* Header */}
      <div className="section-padding flex items-end justify-between mb-4">
        <div>
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-2">Collection</p>
          <h2 className="luxury-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
            {t("title")}
          </h2>
        </div>
        <Link
          href={`/${locale}/shop`}
          className="hidden sm:flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground/35 hover:text-gold transition-colors group"
        >
          {t("viewAll")}
          <ArrowUpRight
            size={13}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </div>

      {/* Diamond grid */}
      <div className="section-padding">
        <ProductDiamondGrid products={products} />
      </div>

      {/* Film strip — full bleed */}
      <div className="mt-4">
        <FilmStrip products={products} />
      </div>

      {/* Mobile view all */}
      <div className="sm:hidden mt-10 text-center section-padding">
        <Link href={`/${locale}/shop`} className="btn-outline inline-block">
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
