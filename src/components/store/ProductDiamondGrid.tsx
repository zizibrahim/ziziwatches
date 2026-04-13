"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
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
  category?: { nameFr: string; nameEn: string; nameAr: string } | null;
}

const CARD_STYLES = [
  { bg: "linear-gradient(135deg, rgba(180,200,255,0.22) 0%, rgba(120,140,220,0.12) 100%)", accent: "rgba(160,180,255,0.55)" },
  { bg: "linear-gradient(135deg, rgba(255,185,210,0.22) 0%, rgba(220,120,160,0.12) 100%)", accent: "rgba(255,160,200,0.55)" },
  { bg: "linear-gradient(135deg, rgba(210,185,255,0.22) 0%, rgba(160,120,230,0.12) 100%)", accent: "rgba(200,160,255,0.55)" },
  { bg: "linear-gradient(135deg, rgba(185,235,215,0.22) 0%, rgba(120,195,160,0.12) 100%)", accent: "rgba(160,220,200,0.55)" },
  { bg: "linear-gradient(135deg, rgba(255,215,160,0.22) 0%, rgba(220,170,100,0.12) 100%)", accent: "rgba(201,168,76,0.55)" },
];

function DiamondCard({
  product,
  position,
  locale,
}: {
  product: Product;
  position: number;
  locale: string;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);

  const name =
    locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const image = product.images[0]?.url ?? "/placeholder.jpg";
  const inStock = product.stock > 0;
  const style = CARD_STYLES[position % CARD_STYLES.length];

  // 3D tilt on the outer wrapper only
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [12, -12]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const cardScale = useSpring(1, { stiffness: 260, damping: 22 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onMouseEnter = () => { setHovered(true); cardScale.set(1.06); };
  const onMouseLeave = () => { setHovered(false); mx.set(0.5); my.set(0.5); cardScale.set(1); };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    addItem({
      id: product.id, slug: product.slug,
      nameFr: product.nameFr, nameEn: product.nameEn, nameAr: product.nameAr,
      price: product.price, image, sku: product.sku,
    } as CartProduct);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx, rotateY: ry, scale: cardScale }}
      initial={{ opacity: 0, scale: 0.72, rotateZ: 15 }}
      whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.65,
        delay: Math.min(position * 0.09, 0.45),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col items-center cursor-pointer"
    >
      <Link href={`/${locale}/shop/${product.slug}`} className="flex flex-col items-center w-full">

        {/* Outer square — contains the rotated diamond */}
        <div className="relative w-full aspect-square flex items-center justify-center">

          {/* ── Diamond frame — plain div so overflow:hidden clips correctly ── */}
          <div
            style={{
              position: "relative",
              width: "70%",
              height: "70%",
              borderRadius: "18%",
              transform: "rotate(45deg)",
              background: style.bg,
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              overflow: "hidden",
              boxShadow: hovered
                ? `0 0 0 2px ${style.accent}, 0 24px 56px rgba(0,0,0,0.35)`
                : "0 0 0 0px rgba(255,255,255,0), 0 8px 28px rgba(0,0,0,0.18)",
              transition: "box-shadow 0.35s ease",
            }}
          >
            {/* Counter-rotated image — scale(√2) fills all 4 diamond tips */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotate(-45deg) scale(1.42)",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={image}
                  alt={name}
                  fill
                  className={`object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </div>

            {/* Inner top highlight */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 35%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              }}
            />

            {/* Inner border */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Badges */}
          {(product.isNew || product.compareAtPrice) && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {product.isNew && (
                <span className="bg-gold text-black text-[7px] font-bold px-2 py-0.5 tracking-widest uppercase">
                  NEW
                </span>
              )}
              {product.compareAtPrice && (
                <span className="bg-black/40 backdrop-blur-sm text-white text-[7px] px-2 py-0.5 uppercase tracking-wider">
                  SALE
                </span>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div
          className="mt-2 text-center px-2 w-full"
          animate={{ opacity: hovered ? 1 : 0.6, y: hovered ? 0 : 3 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="luxury-heading text-xs sm:text-sm font-light text-foreground/85 leading-snug truncate">
            {name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-gold text-[11px] font-medium">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-foreground/25 text-[9px] line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={!inStock}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 text-[8px] tracking-[0.25em] uppercase text-gold/70 hover:text-gold transition-colors disabled:opacity-30"
          >
            + Ajouter
          </motion.button>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ProductDiamondGrid({ products }: { products: Product[] }) {
  const locale = useLocale();

  // 2-3-2-3… honeycomb rows
  // 2-card rows (16.667% padding each side) → each card = 33.33% width
  // 3-card rows (no padding)               → each card = 33.33% width
  // Centers of 2-card row sit over the gaps of 3-card row ✓
  const rows: Product[][] = [];
  let i = 0;
  let rowNum = 0;
  while (i < products.length) {
    const size = rowNum % 2 === 0 ? 2 : 3;
    rows.push(products.slice(i, i + size));
    i += size;
    rowNum++;
  }

  let counter = 0;
  const rowsWithPos = rows.map((row) =>
    row.map((product) => ({ product, pos: counter++ }))
  );

  // Each card is always 1/3 of the container width.
  // Even rows (2-card) get 1/6 base offset each side for the honeycomb.
  // Partial rows get extra padding so lone/partial cards don't stretch full-width.
  const CARD_WIDTH_PCT = 100 / 3; // 33.333%

  return (
    <div className="py-8 max-w-2xl mx-auto">
      {rowsWithPos.map((row, ri) => {
        const expectedSize = ri % 2 === 0 ? 2 : 3;
        const isEvenRow = ri % 2 === 0;
        // Honeycomb offset for even rows
        const basePadding = isEvenRow ? CARD_WIDTH_PCT / 2 : 0; // 16.667% for 2-card rows
        // Extra padding to keep partial rows at the same card width
        const missingCards = expectedSize - row.length;
        const extraPadding = missingCards * (CARD_WIDTH_PCT / 2);
        const totalPadding = basePadding + extraPadding;

        return (
          <div
            key={ri}
            className="flex"
            style={{
              marginTop: ri === 0 ? 0 : "-8%",
              paddingLeft: `${totalPadding}%`,
              paddingRight: `${totalPadding}%`,
              position: "relative",
              zIndex: rowsWithPos.length - ri,
            }}
          >
            {row.map(({ product, pos }) => (
              <div key={product.id} style={{ flex: "1" }}>
                <DiamondCard product={product} position={pos} locale={locale} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
