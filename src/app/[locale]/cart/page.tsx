"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Trash2, ArrowRight, Package, Gift } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 flex items-center justify-center section-padding">
          <div className="text-center">
            <p className="luxury-heading text-3xl font-light text-foreground/60 mb-6">
              {t("empty")}
            </p>
            <Link href={`/${locale}/shop`} className="btn-outline inline-block">
              {t("continueShopping")}
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
      <main className="min-h-screen pt-24">
        <div className="section-padding py-12 max-w-5xl mx-auto">
          <h1 className="luxury-heading text-4xl font-light text-foreground mb-10">
            {t("title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(({ product, quantity, packaging, packagingPrice }) => {
                const name =
                  locale === "en"
                    ? product.nameEn
                    : locale === "ar"
                    ? product.nameAr
                    : product.nameFr;
                const unitTotal = (product.price + packagingPrice) * quantity;
                return (
                  <div
                    key={`${product.id}__${packaging}`}
                    className="flex gap-4 p-4 bg-surface border border-border"
                  >
                    <div className="relative w-20 h-20 shrink-0 bg-background overflow-hidden">
                      <Image
                        src={product.image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="luxury-heading text-base font-light text-foreground truncate">
                        {name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-foreground/40 text-xs font-mono">{product.sku}</p>
                        <span className="flex items-center gap-1 text-[10px] text-foreground/40">
                          {packaging === "coffret"
                            ? <><Gift size={10} className="text-gold" /> Avec coffret</>
                            : <><Package size={10} /> Boîte simple</>}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, packaging)}
                            className="w-7 h-7 text-foreground/60 hover:text-gold text-lg"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-foreground/80 text-sm">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, packaging)}
                            className="w-7 h-7 text-foreground/60 hover:text-gold text-lg"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gold font-medium text-sm">
                            {formatPrice(unitTotal)}
                          </span>
                          <button
                            onClick={() => removeItem(product.id, packaging)}
                            className="text-foreground/30 hover:text-red-400 transition-colors"
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

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border p-6 sticky top-24">
                <h2 className="text-foreground/80 text-xs tracking-[0.2em] uppercase font-medium mb-6">
                  {t("title")}
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">{t("subtotal")}</span>
                    <span className="text-foreground/80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">{t("shipping")}</span>
                    <span className="text-green-400 text-xs uppercase tracking-wider">
                      {t("free")}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-foreground font-medium text-sm">{t("total")}</span>
                    <span className="text-gold font-medium">{formatPrice(subtotal)}</span>
                  </div>
                </div>
                <Link
                  href={`/${locale}/checkout`}
                  className="btn-gold w-full flex items-center justify-center gap-2 text-center"
                >
                  {t("checkout")}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href={`/${locale}/shop`}
                  className="block text-center text-foreground/40 hover:text-foreground/70 text-xs mt-4 transition-colors"
                >
                  {t("continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
