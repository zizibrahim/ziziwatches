"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft, Watch, Gem, Truck, Package, CreditCard, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Faq = {
  id: string;
  questionFr: string;
  questionEn: string;
  questionAr: string;
  answerFr: string;
  answerEn: string;
  answerAr: string;
};

const ICONS: Record<string, React.ElementType> = {
  watches:   Watch,
  jewellery: Gem,
  shipping:  Truck,
  orders:    Package,
  payment:   CreditCard,
  account:   UserCircle,
};

function q(faq: Faq, locale: string) {
  return locale === "ar" ? faq.questionAr : locale === "en" ? faq.questionEn : faq.questionFr;
}
function a(faq: Faq, locale: string) {
  return locale === "ar" ? faq.answerAr : locale === "en" ? faq.answerEn : faq.answerFr;
}

export default function FaqCategoryClient({
  faqs,
  locale,
  category,
  labelEn,
  labelFr,
}: {
  faqs: Faq[];
  locale: string;
  category: string;
  labelEn: string;
  labelFr: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const Icon = ICONS[category] ?? Watch;
  const label = locale === "fr" ? labelFr : labelEn;

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Back */}
        <Link
          href={`/${locale}/faq`}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All categories
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <Icon size={24} strokeWidth={1.5} className="text-gold" />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/30 mb-3">FAQs</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">{label}</h1>
        </div>

        {/* Questions */}
        {faqs.length === 0 ? (
          <div className="text-center py-16 border border-border">
            <p className="text-foreground/40 text-sm mb-4">
              {locale === "fr"
                ? "Aucune question dans cette catégorie pour le moment."
                : "No questions in this category yet."}
            </p>
            <Link
              href={`/${locale}/faq`}
              className="text-xs tracking-[0.2em] uppercase text-gold hover:underline"
            >
              Back to FAQs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border border-t border-b border-border">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group"
                >
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {q(faq, locale)}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-foreground/40 transition-transform duration-200 ${
                      openId === faq.id ? "rotate-180 text-gold" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-foreground/50 leading-relaxed pr-6">
                        {a(faq, locale)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
