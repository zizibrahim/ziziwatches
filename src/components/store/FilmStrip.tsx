"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  images: { url: string; altFr: string | null }[];
}

function Perforations({ count = 28 }: { count?: number }) {
  return (
    <div className="flex items-center gap-[5px] px-3 py-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 rounded-[2px] bg-foreground/12"
          style={{ width: 13, height: 9 }}
        />
      ))}
    </div>
  );
}

function FilmFrame({ product, locale }: { product: Product; locale: string }) {
  const [hovered, setHovered] = useState(false);
  const name =
    locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const image = product.images[0]?.url ?? "/placeholder.jpg";

  return (
    <Link
      href={`/${locale}/shop/${product.slug}`}
      className="relative flex-shrink-0 overflow-hidden"
      style={{ width: 220, height: 220 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thin film frame lines */}
      <div className="absolute inset-0 border-l border-r border-white/8 z-10 pointer-events-none" />

      <Image
        src={image}
        alt={name}
        fill
        className={`object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
        sizes="220px"
      />

      {/* Dark overlay that lifts on hover */}
      <div
        className="absolute inset-0 transition-colors duration-400"
        style={{ background: hovered ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.38)" }}
      />

      {/* Film grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "128px",
        }}
      />

      {/* Info on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-white/50 text-[8px] tracking-[0.3em] uppercase mb-0.5 font-mono">
          Ziziwatches
        </p>
        <h4 className="luxury-heading text-white text-sm font-light leading-tight truncate">{name}</h4>
        <p className="text-gold text-xs mt-0.5">{formatPrice(product.price)}</p>
      </motion.div>

      {/* Frame number — film aesthetic */}
      <span className="absolute top-2 right-2 text-white/20 text-[9px] font-mono tracking-widest z-10">
        {String(product.id.slice(-2)).toUpperCase()}▲
      </span>
    </Link>
  );
}

export default function FilmStrip({ products }: { products: Product[] }) {
  const locale = useLocale();

  if (products.length === 0) return null;

  // Triplicate for seamless infinite scroll
  const frames = [...products, ...products, ...products];
  const totalWidth = products.length * (220 + 2); // frame width + gap

  return (
    <div className="bg-[#0a0a0a] border-y border-white/5 select-none">
      {/* Top perforations */}
      <div className="overflow-hidden">
        <Perforations count={32} />
      </div>

      {/* Scrolling frames */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-0.5"
          animate={{ x: [0, -totalWidth] }}
          transition={{
            duration: products.length * 4,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {frames.map((product, i) => (
            <FilmFrame key={`${product.id}-${i}`} product={product} locale={locale} />
          ))}
        </motion.div>
      </div>

      {/* Bottom perforations */}
      <div className="overflow-hidden">
        <Perforations count={32} />
      </div>
    </div>
  );
}
