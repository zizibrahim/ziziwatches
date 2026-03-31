"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, Truck, Banknote, Headphones } from "lucide-react";

const icons = [Star, Truck, Banknote, Headphones];

export default function BrandFeatures() {
  const t = useTranslations("home.features");

  const features = [
    { icon: icons[0], title: t("quality"), desc: t("qualityDesc") },
    { icon: icons[1], title: t("delivery"), desc: t("deliveryDesc") },
    { icon: icons[2], title: t("payment"), desc: t("paymentDesc") },
    { icon: icons[3], title: t("support"), desc: t("supportDesc") },
  ];

  return (
    <section className="section-padding py-16 border-y border-border">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-10 h-10 border border-gold/30 flex items-center justify-center">
                <Icon size={18} className="text-gold" strokeWidth={1.5} />
              </div>
              <h4 className="text-foreground text-xs tracking-[0.15em] uppercase font-medium">
                {f.title}
              </h4>
              <p className="text-foreground/40 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
