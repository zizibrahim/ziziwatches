"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, Check } from "lucide-react";
import { useCartStore, type CartProduct } from "@/store/cartStore";

interface AddToCartButtonProps {
  product: CartProduct;
  inStock: boolean;
}

export default function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-foreground/40 text-xs uppercase tracking-wider">Qté</span>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 text-foreground/60 hover:text-gold transition-colors text-lg"
          >
            −
          </button>
          <span className="w-8 text-center text-foreground/80 text-sm">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-8 h-8 text-foreground/60 hover:text-gold transition-colors text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
          added
            ? "bg-green-600 text-foreground"
            : inStock
            ? "bg-gold text-obsidian hover:bg-gold-light active:scale-[0.99]"
            : "bg-border text-foreground/30 cursor-not-allowed"
        }`}
      >
        {added ? (
          <>
            <Check size={16} />
            Ajouté !
          </>
        ) : (
          <>
            <ShoppingBag size={16} />
            {inStock ? t("addToCart") : t("outOfStock")}
          </>
        )}
      </button>
    </div>
  );
}
