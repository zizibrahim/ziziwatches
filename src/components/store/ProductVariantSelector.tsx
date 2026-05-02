"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import type { ProductVariant } from "./ColorSwatches";

interface Attribute { key: string; value: string }
interface BaseImage  { url: string; altFr?: string | null }

interface Props {
  productId: string;
  productSlug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  sku: string;
  coffretPrice: number | null;
  stock: number;
  baseImages: BaseImage[];
  variants: ProductVariant[];
  categoryName: string | null;
  inStockLabel: string;
  outOfStockLabel: string;
  addToCartLabel: string;
  specsLabel: string;
  skuLabel: string;
  attributes: Attribute[];
}

const GOLD = "#c9a84c";
const OLIVE = "#4a5240";

export default function ProductVariantSelector({
  productId, productSlug, name, description,
  price, compareAtPrice,
  nameFr, nameEn, nameAr, sku, coffretPrice,
  stock, baseImages, variants,
  categoryName,
  inStockLabel, outOfStockLabel,
  specsLabel, skuLabel, attributes,
}: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );

  const allVariantImages: BaseImage[] = variants.flatMap(v =>
    v.images.map(img => ({ url: img.url, altFr: null }))
  );
  const displayImages: BaseImage[] = [...baseImages, ...allVariantImages];

  const variantStockSet = selectedVariant != null && (selectedVariant.stock > 0 || variants.some(v => v.stock > 0));
  const effectiveStock  = variantStockSet ? selectedVariant!.stock : stock;
  const inStock         = effectiveStock > 0;
  const discount        = compareAtPrice ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <>
      {/* ── Left: photo grid ── */}
      <ProductGallery images={displayImages} productName={name} />

      {/* ── Right: info panel ── */}
      <div className="flex flex-col lg:sticky lg:top-28 lg:self-start">

        {/* Category */}
        {categoryName && (
          <p className="text-[10px] tracking-[0.45em] uppercase mb-2" style={{ color: GOLD }}>
            {categoryName}
          </p>
        )}

        {/* Name + price row */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <h1 className="luxury-heading text-3xl sm:text-4xl font-light text-foreground leading-tight">
            {name}
          </h1>
          <div className="text-right shrink-0">
            <p className="text-2xl font-light" style={{ color: OLIVE }}>{formatPrice(price)}</p>
            {compareAtPrice && (
              <p className="text-sm text-foreground/35 line-through">{formatPrice(compareAtPrice)}</p>
            )}
          </div>
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="mb-4">
            <span className="text-[10px] px-2 py-0.5 text-white tracking-wider" style={{ background: OLIVE }}>
              -{discount}% de réduction
            </span>
          </div>
        )}

        {/* Stars row */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={GOLD}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                  stroke={GOLD} strokeWidth="1" strokeLinejoin="round" />
              </svg>
            ))}
          </div>
          <span className="text-[11px] text-foreground/40">Produit vérifié Ziziwatches</span>
        </div>

        <div className="h-px bg-border/50 mb-5" />

        {/* Variant image thumbnails */}
        {variants.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-3">
              Couleur — <span className="text-foreground/70">{selectedVariant?.colorName}</span>
            </p>
            <div className="flex gap-2 flex-wrap">
              {variants.map(v => {
                const thumb = v.images[0]?.url;
                const isSelected = selectedVariant?.id === v.id;
                const outOfStock = variants.some(x => x.stock > 0) && v.stock === 0;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className="relative w-16 h-16 overflow-hidden transition-all duration-200"
                    style={{
                      border: isSelected ? `2px solid ${OLIVE}` : "2px solid transparent",
                      outline: isSelected ? `1px solid ${OLIVE}` : "1px solid #e2e2e2",
                      opacity: outOfStock ? 0.4 : 1,
                    }}
                    title={v.colorName}
                  >
                    {thumb ? (
                      <Image src={thumb} alt={v.colorName} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full" style={{ background: v.colorHex ?? "#ccc" }} />
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                          <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    {outOfStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <div className="w-full h-px rotate-45 bg-foreground/40" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="flex items-center gap-2 mb-6">
          <span className={`w-2 h-2 rounded-full ${inStock ? "bg-emerald-400" : "bg-red-400"}`} />
          <span className="text-xs text-foreground/50 tracking-wide">
            {inStock ? inStockLabel : outOfStockLabel}
            {inStock && effectiveStock <= 5 && (
              <span className="ml-1 text-amber-500">— {effectiveStock} restant{effectiveStock > 1 ? "s" : ""}</span>
            )}
          </span>
        </div>

        {/* CTA */}
        <AddToCartButton
          product={{ id: productId, slug: productSlug, nameFr, nameEn, nameAr, price, image: displayImages[0]?.url ?? "", sku, coffretPrice }}
          inStock={inStock}
          selectedVariant={selectedVariant ? { color: selectedVariant.colorName, colorHex: selectedVariant.colorHex } : null}
        />

        {/* Trust list */}
        <div className="mt-6 pt-6 border-t border-border/40 space-y-3.5">
          {[
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
              text: "Livraison gratuite au Maroc",
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              text: "Produit 100% authentique",
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
              text: "Retours acceptés sous 7 jours",
            },
            {
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              text: "Paiement à la livraison disponible",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-foreground/50">
              <span className="shrink-0" style={{ color: OLIVE }}>{item.icon}</span>
              <span className="text-xs tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>

        {/* SKU only */}
        <div className="mt-5 pt-4 border-t border-border/30">
          <p className="text-[10px] text-foreground/30 tracking-wider">
            Réf. <span className="font-mono">{sku}</span>
          </p>
        </div>
      </div>
    </>
  );
}
