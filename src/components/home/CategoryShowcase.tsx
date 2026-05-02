"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    slug: "montres-homme",
    label: "Montres Homme",
    sub: "Collection masculine",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=85",
    num: "01",
  },
  {
    slug: "montres-femme",
    label: "Montres Femme",
    sub: "Élégance au poignet",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=85",
    num: "02",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    sub: "Bracelets & étuis",
    image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=85",
    num: "03",
  },
  {
    slug: "packs",
    label: "Packs",
    sub: "Offres groupées",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=85",
    num: "04",
  },
  {
    slug: "cadeaux",
    label: "Cadeaux",
    sub: "Idées cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=85",
    num: "05",
  },
];

export default function CategoryShowcase() {
  const locale = useLocale();

  return (
    <section className="bg-background py-12 sm:py-20 lg:py-32">

      {/* Section header */}
      <div className="section-padding mb-8 sm:mb-10 lg:mb-14">
        <div className="flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-gold inline-block" />
              Explorer
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="luxury-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-foreground"
            >
              Nos Collections
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
              Tout voir
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="section-padding">
        {/* Desktop: 5-column row */}
        <div className="hidden md:grid grid-cols-5 gap-3 lg:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/${locale}/shop?category=${cat.slug}`}
                className="group block"
              >
                {/* Image */}
                <div className="relative aspect-[2/3] overflow-hidden mb-4">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    sizes="20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  {/* Number */}
                  <span className="absolute top-3 left-3 luxury-heading text-4xl font-light text-white/[0.07] select-none leading-none">
                    {cat.num}
                  </span>
                  {/* Arrow on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="w-7 h-7 bg-gold flex items-center justify-center">
                      <ArrowUpRight size={12} className="text-black" />
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gold/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>

                {/* Label */}
                <div>
                  <p className="text-foreground/30 text-[10px] tracking-[0.3em] uppercase mb-1 font-light">
                    {cat.sub}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground text-sm font-light luxury-heading tracking-wide group-hover:text-gold transition-colors duration-300">
                      {cat.label}
                    </h3>
                  </div>
                  <div className="h-px w-0 group-hover:w-full bg-gold/40 mt-2 transition-all duration-500 ease-out" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: 2-column grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={i === 0 ? "col-span-2" : ""}
            >
              <Link href={`/${locale}/shop?category=${cat.slug}`} className="group block">
                <div className={`relative overflow-hidden mb-3 ${i === 0 ? "aspect-[16/9]" : "aspect-[3/4]"}`}>
                  <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.05]" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-0.5">{cat.sub}</p>
                    <p className="text-white text-sm font-light luxury-heading">{cat.label}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
}
