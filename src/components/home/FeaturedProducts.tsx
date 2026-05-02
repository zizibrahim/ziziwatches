"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useRef } from "react";
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

function ProductCard({ product, index }: { product: Product; index: number }) {
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const ref = useRef<HTMLDivElement>(null);

  const name = locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
  const catName = product.category
    ? locale === "en" ? product.category.nameEn : locale === "ar" ? product.category.nameAr : product.category.nameFr
    : null;
  const image = product.images[0]?.url ?? "/placeholder.jpg";
  const num = String(index + 1).padStart(2, "0");

  // 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onMouseLeave = () => { mx.set(0.5); my.set(0.5); };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) return;
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
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/${locale}/shop/${product.slug}`} className="block">

        {/* Card image */}
        <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] opacity-90 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

          {/* Gold top shimmer on hover */}
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500" />
          <div className="absolute bottom-[4.5rem] left-3 w-5 h-5 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500" />
          <div className="absolute bottom-[4.5rem] right-3 w-5 h-5 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/70 transition-all duration-500" />

          {/* Ghost number */}
          <span className="absolute top-2 left-4 luxury-heading text-[5rem] font-light text-white/[0.05] select-none leading-none pointer-events-none">
            {num}
          </span>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
            {product.isNew && (
              <span className="bg-gold text-black text-[8px] font-bold px-2.5 py-0.5 tracking-[0.2em] uppercase">
                New
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-white/10 backdrop-blur-sm text-white text-[8px] px-2.5 py-0.5 tracking-[0.2em] uppercase">
                Sale
              </span>
            )}
          </div>

          {/* Arrow */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-20">
            <div className="w-8 h-8 bg-gold flex items-center justify-center">
              <ArrowUpRight size={13} className="text-black" />
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {catName && (
              <p className="text-white/35 text-[9px] tracking-[0.35em] uppercase mb-1 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {catName}
              </p>
            )}
            <h3 className="luxury-heading text-white font-light text-base leading-tight mb-2">
              {name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gold text-sm font-medium">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-white/25 text-xs line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
              </div>
              {product.stock > 0 && (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 text-[9px] tracking-[0.2em] uppercase text-white/50 hover:text-gold border border-white/15 hover:border-gold/40 px-2.5 py-1.5 backdrop-blur-sm"
                >
                  <ShoppingBag size={9} />
                  Ajouter
                </button>
              )}
            </div>
            {/* Gold line */}
            <div className="h-px w-0 group-hover:w-full bg-gold/50 mt-2.5 transition-all duration-600 ease-out" />
          </div>
        </div>

      </Link>
    </motion.div>
  );
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const locale = useLocale();
  const [first, ...rest] = products;

  return (
    <section className="relative bg-background py-12 sm:py-20 lg:py-32 overflow-hidden">

      <div className="section-padding relative z-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10 lg:mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-px bg-gold/60" />
              <p className="text-gold text-[10px] tracking-[0.55em] uppercase font-medium">Notre boutique</p>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="luxury-heading font-light text-foreground leading-tight"
              style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)" }}
            >
              Nos Meilleures Ventes
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href={`/${locale}/shop`}
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-foreground/30 hover:text-gold transition-colors group"
            >
              Voir tout
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div style={{ perspective: "1200px" }}>
          {products.length === 1 && (
            <div className="max-w-xs mx-auto">
              <ProductCard product={first} index={0} />
            </div>
          )}

          {products.length === 2 && (
            <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}

          {products.length === 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}

          {products.length >= 4 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {products.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center sm:hidden"
        >
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 border border-white/15 text-white/40 text-[10px] tracking-[0.3em] uppercase px-6 py-3 hover:border-gold/40 hover:text-gold transition-colors"
          >
            Voir tout
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
