"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

const HERO_IMAGE = "/pic1.jpg";

export default function HeroSection() {
  const locale = useLocale();

  return (
    <section className="relative h-[85vh] bg-white overflow-hidden pt-28">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Ziziwatches Hero"
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={85}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="section-padding w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Left Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight">
                L'élégance commence<br />dans les détails
              </h1>
            </motion.div>

            {/* Right - Bestsellers Section */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-right space-y-4"
            >
              <div>
                <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-2 font-bold">
                  Discover our
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  BESTSELLERS
                </h2>
              </div>

              <div className="flex gap-3 justify-end">
                <Link
                  href={`/${locale}/bestsellers/women`}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase bg-white text-black border border-white rounded-full hover:bg-white/80 transition-all duration-300"
                >
                  FOR HER
                </Link>
                <Link
                  href={`/${locale}/bestsellers/men`}
                  className="px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase bg-white text-black border border-white rounded-full hover:bg-white/80 transition-all duration-300"
                >
                  FOR HIM
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
