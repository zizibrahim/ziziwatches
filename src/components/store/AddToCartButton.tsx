"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Package, Gift, ArrowRight } from "lucide-react";
import { useCartStore, type CartProduct } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface AddToCartButtonProps {
  product: CartProduct;
  inStock: boolean;
  selectedVariant?: { color: string; colorHex?: string | null } | null;
}

export default function AddToCartButton({ product, inStock, selectedVariant = null }: AddToCartButtonProps) {
  const t = useTranslations("product");
  const locale = useLocale();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [packaging, setPackaging] = useState<"simple" | "coffret">("simple");

  const hasCoffret = !!product.coffretPrice;

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, qty, packaging, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addItem(product, qty, packaging, selectedVariant);
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="space-y-4">

      {/* Quantity row */}
      <div className="flex items-center gap-5">
        <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">Quantité</span>
        <div className="flex items-center border border-border">
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 flex items-center justify-center text-foreground/50 hover:text-olive transition-colors text-xl leading-none">
            −
          </button>
          <span className="w-9 text-center text-foreground/80 text-sm">{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            className="w-9 h-9 flex items-center justify-center text-foreground/50 hover:text-olive transition-colors text-xl leading-none">
            +
          </button>
        </div>
      </div>

      {/* Add to cart — large full-width */}
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-semibold tracking-[0.22em] uppercase transition-all duration-300 active:scale-[0.99] ${
          added
            ? "bg-emerald-600 text-white"
            : inStock
            ? "bg-olive text-white hover:bg-olive/90"
            : "bg-border text-foreground/30 cursor-not-allowed"
        }`}
      >
        {added ? <><Check size={17} /> Ajouté au panier !</> : <><ShoppingBag size={17} /> {inStock ? "Ajouter au panier" : "Épuisé"}</>}
      </button>

      {/* Buy now */}
      {inStock && (
        <button
          onClick={handleBuyNow}
          className="w-full flex items-center justify-center gap-2 py-3.5 text-sm tracking-[0.18em] uppercase border border-foreground/20 text-foreground/65 hover:border-olive hover:text-olive transition-all duration-300 active:scale-[0.99]"
        >
          <ArrowRight size={15} />
          Commander maintenant
        </button>
      )}

      {/* Coffret checkbox */}
      {hasCoffret && (
        <label className="flex items-center gap-3 cursor-pointer group mt-1">
          <div
            onClick={() => setPackaging(p => p === "coffret" ? "simple" : "coffret")}
            className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
              packaging === "coffret" ? "bg-olive border-olive" : "border-border group-hover:border-olive/50"
            }`}
          >
            {packaging === "coffret" && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors flex items-center gap-1.5">
            <Gift size={14} className="text-olive shrink-0" />
            Ajouter un coffret cadeau
            <span className="text-olive font-medium">+{formatPrice(product.coffretPrice!)}</span>
          </span>
        </label>
      )}
    </div>
  );
}
