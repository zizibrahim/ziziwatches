"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Trash2, ArrowRight, Package, Gift, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const OLIVE = "#4a5240";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center section-padding">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
              <ShoppingBag size={24} className="text-foreground/25" />
            </div>
            <h1 className="luxury-heading text-2xl font-light text-foreground mb-2">{t("empty")}</h1>
            <p className="text-sm text-foreground/40 mb-8">Votre panier est vide pour le moment.</p>
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
              style={{ background: OLIVE }}
            >
              Découvrir la boutique
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="border-b border-border/50">
          <div className="section-padding py-3 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/35 pt-20 lg:pt-24">
            <Link href={`/${locale}`} className="hover:text-foreground/60 transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-foreground/70">Panier</span>
          </div>
        </div>

        <div className="section-padding py-10 lg:py-16 max-w-6xl mx-auto">

          {/* Heading */}
          <div className="flex items-center gap-5 mb-10">
            <h1 className="luxury-heading text-3xl font-light text-foreground whitespace-nowrap">
              Mon Panier
            </h1>
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-foreground/35 tracking-wider shrink-0">
              {items.length} article{items.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

            {/* ── Items list ── */}
            <div className="space-y-0 divide-y divide-border/50 border-t border-b border-border/50">
              {items.map(({ product, quantity, packaging, packagingPrice, variantColor, variantColorHex }) => {
                const name =
                  locale === "en" ? product.nameEn
                  : locale === "ar" ? product.nameAr
                  : product.nameFr;
                const unitTotal = (product.price + packagingPrice) * quantity;

                return (
                  <div
                    key={`${product.id}__${packaging}__${variantColor ?? ""}`}
                    className="flex gap-5 py-6"
                  >
                    {/* Image */}
                    <Link href={`/${locale}/shop/${product.slug}`} className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-surface overflow-hidden block">
                      <Image
                        src={product.image}
                        alt={name}
                        fill
                        className="object-cover hover:scale-[1.03] transition-transform duration-500"
                        sizes="112px"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <Link href={`/${locale}/shop/${product.slug}`}>
                          <h3 className="luxury-heading text-base font-light text-foreground hover:opacity-70 transition-opacity">
                            {name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-foreground/35 font-mono tracking-wider">{product.sku}</span>
                          {variantColor && (
                            <span className="flex items-center gap-1.5 text-[10px] text-foreground/45">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-border/60 inline-block shrink-0"
                                style={{ background: variantColorHex ?? "#888" }}
                              />
                              {variantColor}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] text-foreground/35">
                            {packaging === "coffret"
                              ? <><Gift size={10} style={{ color: OLIVE }} /> Coffret cadeau</>
                              : <><Package size={10} /> Boîte standard</>}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Qty control */}
                        <div className="flex items-center border border-border/70">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, packaging, variantColor)}
                            className="w-8 h-8 text-foreground/50 hover:text-foreground transition-colors text-base leading-none"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-foreground/80 text-sm">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, packaging, variantColor)}
                            className="w-8 h-8 text-foreground/50 hover:text-foreground transition-colors text-base leading-none"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-5">
                          <span className="font-medium text-sm" style={{ color: OLIVE }}>
                            {formatPrice(unitTotal)}
                          </span>
                          <button
                            onClick={() => removeItem(product.id, packaging, variantColor)}
                            className="text-foreground/25 hover:text-red-400 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-28">
              <div className="border border-border/60 p-6 bg-surface/50">

                <h2 className="text-xs tracking-[0.3em] uppercase text-foreground/50 mb-6">
                  Récapitulatif
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Sous-total</span>
                    <span className="text-foreground/80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Livraison</span>
                    <span className="text-xs uppercase tracking-wider" style={{ color: OLIVE }}>
                      Gratuite
                    </span>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-xl font-light" style={{ color: OLIVE }}>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="text-[10px] text-foreground/30 mt-1">Paiement à la livraison disponible</p>
                </div>

                <Link
                  href={`/${locale}/checkout`}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 text-xs uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80"
                  style={{ background: OLIVE }}
                >
                  Commander
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href={`/${locale}/shop`}
                  className="block text-center text-foreground/35 hover:text-foreground/60 text-xs mt-4 transition-colors tracking-wide"
                >
                  ← Continuer mes achats
                </Link>
              </div>

              {/* Trust signals */}
              <div className="mt-4 p-4 border border-border/40 space-y-2.5">
                {[
                  "Livraison gratuite au Maroc",
                  "Paiement à la livraison",
                  "Retours acceptés sous 7 jours",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="6" fill={OLIVE} />
                      <polyline points="3,6 5,8.5 9,3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[11px] text-foreground/45">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
