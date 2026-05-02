"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const TABS = [
  { label: "Montres Homme", slug: "montres-homme" },
  { label: "Montres Femme", slug: "montres-femme" },
  { label: "Packs",         slug: "packs"         },
  { label: "Accessoires",   slug: "accessoires"   },
];

const VISIBLE = 4;

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  images: { url: string }[];
}

export default function BestsellersSection() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setPage(0);
    fetch(`/api/products?category=${TABS[activeTab].slug}&limit=8`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const totalPages = Math.ceil(products.length / VISIBLE);
  const visible = products.slice(page * VISIBLE, page * VISIBLE + VISIBLE);

  const prev = () => setPage((p) => Math.max(0, p - 1));
  const next = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <section className="bg-white py-14 sm:py-20">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="luxury-heading text-center text-foreground text-2xl sm:text-3xl tracking-[0.25em] uppercase mb-8"
      >
        Discover Our Bestsellers
      </motion.h2>

      {/* Tabs */}
      <div className="flex justify-center mb-10 px-4">
        <div className="inline-flex items-center bg-[#ede9e1] rounded-full p-2 gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(i)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm tracking-[0.15em] uppercase font-light transition-all duration-300 whitespace-nowrap ${
                activeTab === i
                  ? "bg-[#4a5240] text-white shadow-sm"
                  : "text-foreground/50 hover:text-[#4a5240]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative px-10 sm:px-14">
        {/* Left arrow */}
        <button
          onClick={prev}
          disabled={page === 0}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-foreground/15 shadow hover:bg-foreground/5 disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${page}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3"
          >
            {loading
              ? Array.from({ length: VISIBLE }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-foreground/5 animate-pulse" />
                ))
              : visible.length > 0
              ? visible.map((product) => {
                  const name = locale === "en" ? product.nameEn : product.nameFr;
                  const image = product.images[0]?.url ?? "/placeholder.jpg";
                  return (
                    <Link
                      key={product.id}
                      href={`/${locale}/shop/${product.slug}`}
                      className="group relative aspect-[4/5] overflow-hidden block"
                    >
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="25vw"
                      />
                      {/* Name + price label */}
                      <div className="absolute bottom-3 left-3 right-3 bg-black/50 border border-white px-3 py-2">
                        <p className="text-white text-xs sm:text-sm font-bold tracking-[0.1em] uppercase truncate">
                          {name} — {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  );
                })
              : (
                  <div className="col-span-4 py-20 flex flex-col items-center justify-center gap-3">
                    <p className="text-foreground/30 text-sm tracking-[0.2em] uppercase">Aucun produit disponible</p>
                    <p className="text-foreground/20 text-xs">Cette catégorie ne contient pas encore de produits.</p>
                  </div>
                )}
          </motion.div>
        </AnimatePresence>

        {/* Right arrow */}
        <button
          onClick={next}
          disabled={page >= totalPages - 1 || totalPages === 0}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-foreground/15 shadow hover:bg-foreground/5 disabled:opacity-20 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === page ? "bg-[#4a5240] scale-125" : "bg-foreground/20"
              }`}
            />
          ))}
        </div>
      )}

      {/* See more */}
      <div className="flex justify-end px-10 sm:px-14 mt-6">
        <Link
          href={`/${locale}/shop?category=${TABS[activeTab].slug}`}
          className="text-xs tracking-[0.2em] uppercase text-foreground/50 border border-foreground/20 px-4 py-2 hover:text-foreground hover:border-foreground/50 transition-all duration-300"
        >
          See More
        </Link>
      </div>
    </section>
  );
}
