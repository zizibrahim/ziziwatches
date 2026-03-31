"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartProduct } from "@/store/cartStore";

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
}

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);

  const name =
    locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const image = product.images[0]?.url ?? "/placeholder.jpg";
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      nameFr: product.nameFr,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image,
      sku: product.sku,
    };
    addItem(cartProduct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/${locale}/shop/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-surface overflow-hidden">
          <Image
            src={image}
            alt={product.images[0]?.altFr ?? name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-background/10 group-hover:bg-background/30 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 ltr:left-3 rtl:right-3 flex gap-2">
            {product.isNew && (
              <span className="bg-gold text-obsidian text-[10px] font-semibold px-2 py-0.5 tracking-wider uppercase">
                {t("new")}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-white/10 backdrop-blur-sm text-foreground text-[10px] px-2 py-0.5 uppercase tracking-wider">
                {t("sale")}
              </span>
            )}
          </div>

          {/* Add to cart hover */}
          <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-gold text-obsidian py-2 text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={12} />
              {inStock ? t("addToCart") : t("outOfStock")}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-3">
          <h3 className="luxury-heading text-base lg:text-lg font-light text-foreground/90 group-hover:text-gold transition-colors duration-300 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
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
  );
}
