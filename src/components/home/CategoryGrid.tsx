"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const categories = [
  {
    slug: "montres-homme",
    label: "Montres Homme",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80",
  },
  {
    slug: "montres-femme",
    label: "Montres Femme",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=800&q=80",
  },
  {
    slug: "packs",
    label: "Packs",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    slug: "cadeaux",
    label: "Cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
  },
  {
    slug: "nouveautes",
    label: "Nouveautés",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80",
  },
];

export default function CategoryGrid() {
  const locale = useLocale();

  return (
    <section className="bg-black">
      <div className="grid grid-cols-3 grid-rows-2">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link
              href={`/${locale}/shop?category=${cat.slug}`}
              className="relative block overflow-hidden group"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 p-4 sm:p-5">
                <p className="text-white text-sm sm:text-base font-light tracking-wide">
                  {cat.label}
                </p>
                <div className="h-px w-0 bg-gold mt-1 group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
