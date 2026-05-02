"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartProduct } from "@/store/cartStore";
import { ShoppingBag, ArrowUpRight } from "lucide-react";

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

function ProductCard({ product, position }: { product: Product; position: number }) {
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);

  const name = locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const catName = product.category
    ? locale === "en" ? product.category.nameEn : locale === "ar" ? product.category.nameAr : product.category.nameFr
    : null;
  const image = product.images[0]?.url ?? "/placeholder.jpg";

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    addItem({
      id: product.id, slug: product.slug,
      nameFr: product.nameFr, nameEn: product.nameEn, nameAr: product.nameAr,
      price: product.price, image, sku: product.sku,
    } as CartProduct);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: Math.min(position * 0.07, 0.35), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/${locale}/shop/${product.slug}`} className="block">

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Gold shimmer top */}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-gold/0 group-hover:border-gold/60 transition-all duration-500" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-gold/0 group-hover:border-gold/60 transition-all duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="bg-gold text-black text-[8px] font-bold px-2 py-0.5 tracking-[0.2em] uppercase">
                New
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-black/50 backdrop-blur-sm text-white text-[8px] px-2 py-0.5 tracking-[0.2em] uppercase">
                Sale
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-foreground/60 text-background text-[8px] px-2 py-0.5 tracking-[0.2em] uppercase">
                Épuisé
              </span>
            )}
          </div>

          {/* Arrow top right */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-10">
            <div className="w-7 h-7 bg-gold flex items-center justify-center">
              <ArrowUpRight size={12} className="text-black" />
            </div>
          </div>

          {/* Quick add — bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm text-white text-[9px] tracking-[0.25em] uppercase py-2.5 hover:bg-gold hover:text-black transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={10} />
              {product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          {catName && (
            <p className="text-foreground/30 text-[9px] tracking-[0.35em] uppercase mb-1.5">
              {catName}
            </p>
          )}
          <h3 className="luxury-heading text-foreground/85 font-light text-sm leading-snug mb-2 group-hover:text-foreground transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-gold font-medium text-sm">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-foreground/25 text-xs line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {/* Gold underline */}
          <div className="h-px w-0 group-hover:w-8 bg-gold mt-2.5 transition-all duration-500 ease-out" />
        </div>

      </Link>
    </motion.div>
  );
}

export default function ProductDiamondGrid({
  products,
  singleRow = false,
}: {
  products: Product[];
  singleRow?: boolean;
}) {
  if (singleRow) {
    return (
      <div className="overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-olive/30 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex gap-4 sm:gap-5" style={{ width: "max-content" }}>
          {products.map((product, i) => (
            <div key={product.id} className="w-[220px] sm:w-[260px] flex-shrink-0">
              <ProductCard product={product} position={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-6 sm:gap-y-8 lg:gap-y-10">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} position={i} />
      ))}
    </div>
  );
}
