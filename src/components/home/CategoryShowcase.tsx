"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Grid: 3 cols × 3 rows
// [  Homme (2×2)  ] [ Femme  ]
// [  Homme (2×2)  ] [ Accss  ]
// [ Packs (1×1) ] [  Cadeaux (2×1) ]
const categories = [
  {
    slug: "montres-homme",
    label: "Montres Homme",
    sub: "Collection masculine",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&q=85",
    span: "col-span-2 sm:col-span-2 sm:row-span-2",
    h: "h-[190px] sm:h-auto",
    num: "01",
  },
  {
    slug: "montres-femme",
    label: "Montres Femme",
    sub: "Élégance au poignet",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=85",
    span: "col-span-1",
    h: "h-[140px] sm:h-auto",
    num: "02",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    sub: "Bracelets & boîtes",
    image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=85",
    span: "col-span-1",
    h: "h-[140px] sm:h-auto",
    num: "03",
  },
  {
    slug: "packs",
    label: "Packs",
    sub: "Offres groupées",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85",
    span: "col-span-1",
    h: "h-[140px] sm:h-auto",
    num: "04",
  },
  {
    slug: "cadeaux",
    label: "Cadeaux",
    sub: "Idées cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=85",
    span: "col-span-1 sm:col-span-2",
    h: "h-[140px] sm:h-auto",
    num: "05",
  },
];

function Tile({
  cat,
  index,
  locale,
}: {
  cat: (typeof categories)[number];
  index: number;
  locale: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 25 });
  const ry = useSpring(useTransform(mx, [0, 1], [-5, 5]), { stiffness: 200, damping: 25 });

  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(201,168,76,0.18) 0%, transparent 55%)`;

  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const onMouseLeave = () => { mx.set(0.5); my.set(0.5); };

  return (
    <motion.div
      ref={ref}
      className={`${cat.span} ${cat.h}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/${locale}/shop?category=${cat.slug}`}
        className="relative flex h-full w-full overflow-hidden group"
      >
        {/* Image */}
        <Image
          src={cat.image}
          alt={cat.label}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 90vw, 45vw"
        />

        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

        {/* Gold glare following cursor */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glare }}
        />

        {/* Category number */}
        <span className="absolute top-4 right-5 luxury-heading text-5xl font-light text-white/[0.06] select-none">
          {cat.num}
        </span>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 flex items-end justify-between">
          <div>
            <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
              {cat.sub}
            </p>
            <h3 className="text-white font-light luxury-heading text-lg sm:text-xl lg:text-2xl leading-tight">
              {cat.label}
            </h3>
            <div className="h-px w-0 group-hover:w-12 bg-gold mt-2 transition-all duration-500 ease-out" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <div className="w-8 h-8 border border-gold/50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <ArrowUpRight size={13} className="text-gold" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategoryShowcase() {
  const locale = useLocale();

  return (
    <section className="bg-background">
      {/* Header */}
      <div className="section-padding pt-20 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gold text-xs tracking-[0.35em] uppercase mb-2">Explorer</p>
            <h2 className="luxury-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              Nos Catégories
            </h2>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="hidden sm:flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground/35 hover:text-gold transition-colors group"
          >
            Tout voir
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bento grid with 3D perspective */}
      <div className="section-padding pb-20 perspective-1200">
        <div className="grid grid-cols-2 sm:grid-cols-3 sm:grid-rows-3 gap-2 sm:gap-3 sm:h-[640px] lg:h-[720px]">
          {categories.map((cat, i) => (
            <Tile key={cat.slug} cat={cat} index={i} locale={locale} />
          ))}
        </div>
        <div className="sm:hidden mt-6 text-center">
          <Link href={`/${locale}/shop`} className="btn-outline inline-block">
            Voir tout
          </Link>
        </div>
      </div>
    </section>
  );
}
