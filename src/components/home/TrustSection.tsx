"use client";

import { motion } from "framer-motion";
import { Truck, Banknote, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: Truck,
    title: "Livraison dans tout le Maroc",
    desc: "Expédition rapide vers toutes les régions",
  },
  {
    icon: Banknote,
    title: "Paiement à la livraison",
    desc: "Payez en cash à la réception de votre commande",
  },
  {
    icon: ShieldCheck,
    title: "Qualité garantie",
    desc: "Chaque produit est soigneusement sélectionné",
  },
];

export default function TrustSection() {
  return (
    <section className="section-padding py-16 border-t border-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            className="flex flex-col items-center text-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="w-10 h-10 flex items-center justify-center border border-gold/30">
              <p.icon size={18} className="text-gold" />
            </div>
            <p className="text-foreground text-sm font-medium tracking-wide">{p.title}</p>
            <p className="text-foreground/40 text-xs leading-relaxed max-w-[200px]">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
