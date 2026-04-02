"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const locale = useLocale();
  const t = useTranslations("shop");
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 section-padding pb-20">
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Ziziwatches</p>
          <h1 className="luxury-heading text-4xl font-light text-foreground">Ma liste de souhaits</h1>
          <p className="text-foreground/40 text-sm mt-1">{items.length} article{items.length !== 1 ? "s" : ""}</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-border">
            <Heart className="mx-auto text-foreground/20 mb-4" size={40} strokeWidth={1} />
            <p className="text-foreground/30 mb-6">Votre liste est vide.</p>
            <Link href={`/${locale}/shop`} className="btn-outline px-8">
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => {
              const name = locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
              return (
                <div key={product.id} className="group bg-surface border border-border">
                  {/* Image */}
                  <Link href={`/${locale}/shop/${product.slug}`} className="block relative aspect-square overflow-hidden bg-background">
                    <Image
                      src={product.image}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    />
                    {/* Remove */}
                    <button
                      onClick={(e) => { e.preventDefault(); removeItem(product.id); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur flex items-center justify-center text-red-400 hover:bg-background transition-colors"
                    >
                      <Heart size={14} fill="currentColor" />
                    </button>
                  </Link>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/${locale}/shop/${product.slug}`}>
                      <h3 className="luxury-heading text-base font-light text-foreground truncate hover:text-gold transition-colors">
                        {name}
                      </h3>
                    </Link>
                    <p className="text-gold font-medium text-sm mt-1">{formatPrice(product.price)}</p>
                    <button
                      onClick={() => addItem(product)}
                      className="btn-gold w-full mt-3 flex items-center justify-center gap-2 text-xs py-2.5"
                    >
                      <ShoppingBag size={13} />
                      {t("addToCart")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
