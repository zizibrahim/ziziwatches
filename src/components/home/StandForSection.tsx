"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Gem, Banknote } from "lucide-react";

const pillars = [
  { icon: Truck,       label: "Livraison\nGratuite"            },
  { icon: Headphones,  label: "Excellent Support\nClient"      },
  { icon: Gem,         label: "Qualité\nExcellente"            },
  { icon: Banknote,    label: "Paiement à\nla Livraison"       },
];

const OLIVE = "#4a5240";

export default function StandForSection() {
  return (
    <section className="bg-white py-14 sm:py-20">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="luxury-heading text-center text-foreground text-2xl sm:text-3xl tracking-[0.3em] uppercase mb-16 sm:mb-20"
      >
        Ce que Ziziwatches représente
      </motion.h2>

      {/* Icons row */}
      <div className="flex items-start justify-center gap-16 sm:gap-36 flex-wrap px-8">
        {pillars.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="flex flex-col items-center gap-5 group w-28 sm:w-36"
          >
            {/* Circle */}
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg"
              style={{ border: `1.5px solid ${OLIVE}` }}
            >
              <p.icon size={42} strokeWidth={0.9} color={OLIVE} />
            </div>

            {/* Divider dot */}
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: OLIVE + "60" }} />

            {/* Label */}
            <p
              className="font-[family-name:var(--font-inter)] text-center text-[10px] sm:text-[11px] tracking-[0.25em] uppercase leading-loose whitespace-pre-line"
              style={{ color: OLIVE }}
            >
              {p.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
