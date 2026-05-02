"use client";

import { motion } from "framer-motion";
import { Truck, Banknote, ShieldCheck, Headphones } from "lucide-react";

const pillars = [
  {
    icon: Truck,
    num: "01",
    title: "Livraison offerte",
    desc: "Partout au Maroc, sous 24 à 48h",
  },
  {
    icon: Banknote,
    num: "02",
    title: "Paiement à la livraison",
    desc: "Payez en cash à la réception de votre commande",
  },
  {
    icon: ShieldCheck,
    num: "03",
    title: "Qualité garantie",
    desc: "Chaque produit est soigneusement sélectionné",
  },
  {
    icon: Headphones,
    num: "04",
    title: "Support réactif",
    desc: "Disponible via WhatsApp 7j/7",
  },
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-surface border-t border-border">

      {/* Subtle gold gradient top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="section-padding pt-12 sm:pt-16 lg:pt-28 pb-0">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <p className="text-gold text-[10px] tracking-[0.6em] uppercase font-medium">Notre Promesse</p>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>
          <h2 className="luxury-heading font-light text-foreground"
            style={{ fontSize: "clamp(1.4rem, 4vw, 3rem)" }}>
            L'excellence à chaque étape
          </h2>
          <p className="text-foreground/35 text-sm mt-3 max-w-sm mx-auto leading-relaxed">
            De la commande à la livraison, nous veillons à chaque détail.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative bg-background border border-border hover:border-gold/30 transition-all duration-500 p-5 sm:p-6 lg:p-8 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Gold top line on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 border border-gold/20 group-hover:border-gold/50 flex items-center justify-center transition-all duration-400 group-hover:bg-gold/5">
                  <p.icon
                    size={22}
                    className="text-gold/50 group-hover:text-gold transition-colors duration-400"
                    strokeWidth={1.5}
                  />
                </div>
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
              </div>

              {/* Text */}
              <p className="text-foreground text-sm font-medium tracking-wide mb-2">
                {p.title}
              </p>
              <p className="text-foreground/35 text-xs leading-relaxed group-hover:text-foreground/55 transition-colors duration-300">
                {p.desc}
              </p>

              {/* Bottom gold dot */}
              <div className="w-1 h-1 rounded-full bg-gold/0 group-hover:bg-gold/60 mt-5 transition-all duration-400" />
            </motion.div>
          ))}
        </div>

      </div>

    </section>
  );
}
