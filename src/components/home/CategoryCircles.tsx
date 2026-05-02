"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const categories = [
  {
    slug: "montres-homme",
    label: "Montres Homme",
    image: "/menwatche.png",
  },
  {
    slug: "montres-femme",
    label: "Montres Femme",
    image: "/womenwatche.png",
  },
  {
    slug: "bijoux-femme",
    label: "Bijoux Femme",
    image: "/bijouxwomen.png",
  },
  {
    slug: "bijoux-homme",
    label: "Bijoux Homme",
    image: "/Men's bracelet.png",
  },
  {
    slug: "packs",
    label: "Packs",
    image: "/pack.png",
  },
  {
    slug: "cadeaux",
    label: "Cadeaux",
    image: "/gift.png",
  },
];

export default function CategoryCircles() {
  const locale = useLocale();

  return (
    <section className="bg-[#f0ede6] py-14 sm:py-20">
      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="luxury-heading text-center text-[#6b6b3a] text-lg sm:text-2xl tracking-[0.3em] uppercase mb-10 sm:mb-14"
      >
        Découvrez la diversité Ziziwatches
      </motion.p>

      {/* Circles row */}
      <div className="px-4 sm:px-8">
        <div className="flex items-start justify-center gap-8 sm:gap-20 flex-wrap sm:flex-nowrap max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col items-center gap-3 group"
            >
              <Link href={`/${locale}/shop?category=${cat.slug}`} className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[#6b6b3a]/40 transition-all duration-300">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="144px"
                  />
                </div>
                <p className="font-[family-name:var(--font-inter)] text-[#3a3a2a] text-sm sm:text-base text-center font-medium tracking-[0.25em] uppercase group-hover:text-[#6b6b3a] transition-colors duration-300">
                  {cat.label}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
