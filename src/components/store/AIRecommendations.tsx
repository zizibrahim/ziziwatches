"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  compareAtPrice?: number | null;
  images: { url: string }[];
}

const OLIVE = "#4a5240";

export default function AIRecommendations({
  productId,
  locale,
  fallback,
}: {
  productId: string;
  locale: string;
  fallback: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(fallback);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ai/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentProductId: productId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations?.length > 0) setProducts(data.recommendations);
      })
      .catch(() => {});
  }, [productId]);

  if (!products.length) return null;

  const getName = (p: Product) =>
    locale === "en" ? p.nameEn : locale === "ar" ? p.nameAr : p.nameFr;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("[data-card]") as HTMLElement;
    const amount = card ? card.offsetWidth + 16 : 300;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const label = locale === "en" ? "OUR CUSTOMERS' FAVOURITES" : locale === "ar" ? "المفضلة لدى عملائنا" : "LES PRÉFÉRÉS DE NOS CLIENTS";

  return (
    <section className="border-t border-border/40 py-14 lg:py-20">
      {/* Heading */}
      <div className="section-padding mb-8">
        <div className="flex items-center gap-5 max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: OLIVE }}>
            {label}
          </h2>
          <div className="flex-1 h-px bg-border/50" />
        </div>
      </div>

      {/* Carousel wrapper */}
      <div className="relative group/carousel">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-border/50 flex items-center justify-center shadow-sm hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Précédent"
        >
          <ChevronLeft size={18} className="text-foreground/70" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-border/50 flex items-center justify-center shadow-sm hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
          aria-label="Suivant"
        >
          <ChevronRight size={18} className="text-foreground/70" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-[var(--section-px,24px)] pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ paddingLeft: "max(24px, calc((100vw - 1280px) / 2 + 24px))", paddingRight: "max(24px, calc((100vw - 1280px) / 2 + 24px))" }}
        >
          {products.map((p) => (
            <div key={p.id} data-card className="shrink-0 w-[220px] sm:w-[260px] lg:w-[280px]">
              {/* Image */}
              <Link href={`/${locale}/shop/${p.slug}`} className="block relative aspect-square bg-surface overflow-hidden group">
                {p.images[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={getName(p)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="280px"
                  />
                )}
              </Link>

              {/* Info */}
              <div className="pt-3 text-center">
                <Link href={`/${locale}/shop/${p.slug}`}>
                  <p className="text-xs font-semibold tracking-[0.18em] uppercase text-foreground hover:text-olive transition-colors">
                    {getName(p)}
                  </p>
                </Link>
                <p className="text-sm font-medium text-foreground/80 mt-1.5">
                  {formatPrice(p.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
