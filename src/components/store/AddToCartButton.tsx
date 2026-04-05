"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, Check, Package, Gift } from "lucide-react";
import { useCartStore, type CartProduct } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface AddToCartButtonProps {
  product: CartProduct;
  inStock: boolean;
}

export default function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  const t = useTranslations("product");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [packaging, setPackaging] = useState<"simple" | "coffret">("simple");

  const hasCoffret = !!product.coffretPrice;

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, qty, packaging);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Packaging selector */}
      {hasCoffret && (
        <div className="space-y-2">
          <span className="text-foreground/40 text-xs uppercase tracking-wider">Présentation</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPackaging("simple")}
              className={`flex items-center gap-2.5 border p-3 text-left transition-colors ${
                packaging === "simple"
                  ? "border-gold bg-gold/5 text-foreground"
                  : "border-border text-foreground/50 hover:border-gold/30"
              }`}
            >
              <Package size={15} className={packaging === "simple" ? "text-gold" : ""} />
              <div>
                <p className="text-xs font-medium">Boîte simple</p>
                <p className="text-[10px] text-foreground/40">Inclus</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPackaging("coffret")}
              className={`flex items-center gap-2.5 border p-3 text-left transition-colors ${
                packaging === "coffret"
                  ? "border-gold bg-gold/5 text-foreground"
                  : "border-border text-foreground/50 hover:border-gold/30"
              }`}
            >
              <Gift size={15} className={packaging === "coffret" ? "text-gold" : ""} />
              <div>
                <p className="text-xs font-medium">Avec coffret</p>
                <p className="text-[10px] text-gold">+{formatPrice(product.coffretPrice!)}</p>
              </div>
            </button>
          </div>
        </div>
      )}

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
