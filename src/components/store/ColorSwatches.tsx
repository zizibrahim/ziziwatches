"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string | null;
  stock: number;
  images: { url: string }[];
}

interface Props {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  useVariantStock?: boolean;
}

export default function ColorSwatches({ variants, selected, onSelect, useVariantStock = false }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!variants.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 h-5">
        <span className="text-foreground/40 text-xs uppercase tracking-wider">Couleur</span>
        <AnimatePresence mode="wait">
          {selected && (
            <motion.span
              key={selected.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 4 }}
              transition={{ duration: 0.18 }}
              className="text-foreground/80 text-xs font-medium"
            >
              — {selected.colorName}
              {useVariantStock && selected.stock === 0 && (
                <span className="ml-1.5 text-foreground/30 font-normal italic">(Épuisé)</span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selected?.id === variant.id;
          const isOutOfStock = useVariantStock && variant.stock === 0;
          const isHovered = hoveredId === variant.id;

          return (
            <div key={variant.id} className="relative flex flex-col items-center gap-1.5">
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 3, scale: 0.95 }}
                    transition={{ duration: 0.14 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap"
                  >
                    <div className="bg-foreground text-background text-[10px] px-2 py-1 rounded-sm leading-none">
                      {variant.colorName}
                      {isOutOfStock && " · Épuisé"}
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => onSelect(variant)}
                onMouseEnter={() => setHoveredId(variant.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative w-9 h-9 rounded-full focus:outline-none transition-transform duration-200"
                style={{
                  background: variant.colorHex ?? "#888",
                  transform: isSelected ? "scale(1.15)" : isHovered ? "scale(1.08)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 0 0 2px hsl(var(--background)), 0 0 0 3.5px #C9A84C, 0 4px 12px ${variant.colorHex ?? "#888"}60`
                    : isHovered
                    ? `0 0 0 1.5px hsl(var(--background)), 0 0 0 2.5px #C9A84C50, 0 3px 8px ${variant.colorHex ?? "#888"}40`
                    : `0 2px 6px ${variant.colorHex ?? "#888"}30`,
                }}
              >
                {/* Inner gloss highlight */}
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />

                {/* Out of stock slash */}
                {isOutOfStock && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
                    <span
                      className="block w-0.5 h-8 rounded-full"
                      style={{ background: "rgba(255,255,255,0.55)", transform: "rotate(45deg)" }}
                    />
                  </span>
                )}

                {/* Selected checkmark */}
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path
                        d="M1 4L4.5 7.5L11 1"
                        stroke="rgba(255,255,255,0.85)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
