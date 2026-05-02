"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Circle {
  label: string;
  href: string;
  image: string;
  icon?: ReactNode;
}

export default function SubCategoryCircles({ circles }: { circles: Circle[] }) {
  return (
    <section className="bg-[#f0ede6] py-14 sm:py-20">
      <div className="overflow-x-auto px-4 sm:px-8 [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-olive/30 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex items-start justify-center gap-8 sm:gap-16 flex-nowrap min-w-max mx-auto">
          {circles.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex flex-col items-center group"
            >
              <Link href={cat.href} className="flex flex-col items-center gap-3">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-olive/40 transition-all duration-300">
                  {cat.icon ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#e8e4dd] group-hover:bg-[#e0dbd2] transition-colors duration-300">
                      {cat.icon}
                    </div>
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="144px"
                    />
                  )}
                </div>
                <p className="text-foreground/80 text-center text-sm font-medium tracking-[0.25em] uppercase group-hover:text-olive transition-colors duration-300 max-w-[110px] leading-snug">
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
