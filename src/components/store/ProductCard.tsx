"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartProduct } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

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

export default function ProductCard({
  product,
  position = 1,
}: {
  product: Product;
  position?: number;
}) {
  const t = useTranslations("shop");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();
  const wished = isWished(product.id);
  const [hovered, setHovered] = useState(false);

  const name =
    locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const catName = product.category
    ? locale === "en"
      ? product.category.nameEn
      : locale === "ar"
      ? product.category.nameAr
      : product.category.nameFr
    : null;
  const image = product.images[0]?.url ?? "/placeholder.jpg";
  const inStock = product.stock > 0;

  // ── Parallelogram skew: odd cards lean left, even lean right ──
  const skewDir = position % 2 === 1 ? -9 : 9;
  const skewMV = useMotionValue(skewDir);
  const skewSpring = useSpring(skewMV, { stiffness: 260, damping: 24 });
  // Counter-skew keeps the image visually straight inside the frame
  const counterSkew = useTransform(skewSpring, (v) => -v);

  // ── 3D tilt (activates once the card snaps straight on hover) ──
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 180, damping: 22 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 180, damping: 22 });

  // ── Gold glare following cursor ──
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(201,168,76,0.15) 0%, transparent 65%)`;

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onMouseEnter = () => {
    setHovered(true);
    skewMV.set(0); // snap straight
  };
  const onMouseLeave = () => {
    setHovered(false);
    mx.set(0.5);
    my.set(0.5);
    skewMV.set(skewDir); // lean back
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock) return;
    const cartProduct: CartProduct = {
      id: product.id, slug: product.slug,
      nameFr: product.nameFr, nameEn: product.nameEn, nameAr: product.nameAr,
      price: product.price, image, sku: product.sku,
    };
    addItem(cartProduct);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay: Math.min((position - 1) * 0.07, 0.35),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group cursor-pointer"
    >
      <Link href={`/${locale}/shop/${product.slug}`} className="block">

        {/* ── Parallelogram image frame ── */}
        <motion.div
          style={{ skewX: skewSpring }}
          animate={{
            boxShadow: hovered
              ? "inset 0 0 0 1px rgba(201,168,76,0.45), 0 24px 56px rgba(0,0,0,0.32)"
              : "inset 0 0 0 0px rgba(201,168,76,0), 0 6px 20px rgba(0,0,0,0.16)",
          }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden aspect-[4/5]"
        >
          {/* Counter-skewed image so it appears straight inside the frame */}
          <motion.div
            style={{ skewX: counterSkew, scale: 1.22 }}
            className="absolute inset-0"
          >
            <Image
              src={image}
              alt={product.images[0]?.altFr ?? name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/8 transition-colors duration-400" />
            {/* Gold glare */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: glare }}
            />
          </motion.div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle({ id: product.id, slug: product.slug, nameFr: product.nameFr, nameEn: product.nameEn, nameAr: product.nameAr, price: product.price, image, sku: product.sku });
            }}
            className="absolute top-3 ltr:right-3 rtl:left-3 w-7 h-7 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all z-10 opacity-0 group-hover:opacity-100"
          >
            <Heart size={11} className={wished ? "text-red-400 fill-red-400" : "text-white/80"} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 ltr:left-3 rtl:right-3 flex gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-gold text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                {t("new")}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-black/30 backdrop-blur-sm text-white text-[9px] px-2 py-0.5 uppercase tracking-wider">
                {t("sale")}
              </span>
            )}
          </div>
        </motion.div>

        {/* ── Info — straight text, not skewed ── */}
        <div className="pt-3">
          {catName && (
            <p className="text-gold/55 text-[8px] tracking-[0.35em] uppercase mb-1">{catName}</p>
          )}
          <h3 className="luxury-heading text-base sm:text-lg font-light text-foreground/80 group-hover:text-foreground transition-colors duration-300 leading-snug">
            {name}
          </h3>

          {/* Animated gold rule */}
          <div className="relative h-px my-2.5 overflow-hidden bg-foreground/8">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gold"
              animate={{ width: hovered ? "100%" : "0%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gold text-sm font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-foreground/25 text-xs line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <motion.button
              onClick={handleAddToCart}
              disabled={!inStock}
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 4 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 bg-gold/10 hover:bg-gold flex items-center justify-center text-gold hover:text-black transition-colors disabled:opacity-30"
            >
              <ShoppingBag size={11} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
