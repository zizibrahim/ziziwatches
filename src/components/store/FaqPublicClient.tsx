"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Faq = {
  id: string;
  questionFr: string;
  questionEn: string;
  questionAr: string;
  answerFr: string;
  answerEn: string;
  answerAr: string;
  category: string;
  popular: boolean;
  order: number;
};

function WatchIcon() {
  return (
    <svg viewBox="0 0 60 90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="21" y="2" width="18" height="16" rx="2.5"/>
      <line x1="25" y1="7" x2="35" y2="7"/><line x1="25" y1="11" x2="35" y2="11"/>
      <circle cx="30" cy="46" r="22"/>
      <circle cx="30" cy="46" r="17"/>
      <line x1="30" y1="31" x2="30" y2="35"/><line x1="30" y1="57" x2="30" y2="61"/>
      <line x1="15" y1="46" x2="19" y2="46"/><line x1="41" y1="46" x2="45" y2="46"/>
      <line x1="30" y1="46" x2="30" y2="38"/>
      <line x1="30" y1="46" x2="37" y2="46"/>
      <circle cx="30" cy="46" r="2" fill="currentColor" stroke="none"/>
      <rect x="21" y="72" width="18" height="16" rx="2.5"/>
      <line x1="25" y1="77" x2="35" y2="77"/><line x1="25" y1="81" x2="35" y2="81"/>
    </svg>
  );
}

function JewelleryIcon() {
  return (
    <svg viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M18 6 C14 6 12 10 14 14 L18 20"/>
      <line x1="18" y1="20" x2="18" y2="36"/>
      <path d="M10 42 L18 36 L26 42 L18 60 Z"/>
      <line x1="18" y1="42" x2="18" y2="48"/>
      <path d="M42 6 C38 6 36 10 38 14 L42 20"/>
      <line x1="42" y1="20" x2="42" y2="36"/>
      <path d="M34 42 L42 36 L50 42 L42 60 Z"/>
      <line x1="42" y1="42" x2="42" y2="48"/>
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 90 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="4" y="14" width="52" height="32" rx="3"/>
      <path d="M56 26 L68 26 L80 38 L80 46 L56 46 Z"/>
      <circle cx="20" cy="48" r="7"/><circle cx="20" cy="48" r="3"/>
      <circle cx="68" cy="48" r="7"/><circle cx="68" cy="48" r="3"/>
      <line x1="56" y1="38" x2="80" y2="38"/>
      <line x1="2" y1="26" x2="8" y2="26"/>
      <line x1="2" y1="32" x2="6" y2="32"/>
      <line x1="2" y1="38" x2="7" y2="38"/>
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 70 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="35" cy="24" r="14"/>
      <path d="M8 72 C8 54 20 46 35 46 C50 46 62 54 62 72"/>
      <line x1="27" y1="19" x2="43" y2="19"/>
      <line x1="27" y1="26" x2="43" y2="26"/>
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg viewBox="0 0 80 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="4" y="10" width="72" height="40" rx="5"/>
      <line x1="4" y1="22" x2="76" y2="22"/>
      <rect x="12" y="32" width="18" height="10" rx="2"/>
      <line x1="42" y1="34" x2="58" y2="34"/>
      <line x1="42" y1="40" x2="52" y2="40"/>
    </svg>
  );
}

function OwnerIcon() {
  return (
    <svg viewBox="0 0 70 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      {/* Crown */}
      <path d="M10 38 L10 24 L22 34 L35 10 L48 34 L60 24 L60 38 Z"/>
      <rect x="8" y="38" width="54" height="10" rx="2"/>
      {/* Jewels on crown */}
      <circle cx="35" cy="20" r="3"/>
      <circle cx="16" cy="30" r="2"/>
      <circle cx="54" cy="30" r="2"/>
      {/* Base */}
      <line x1="14" y1="48" x2="14" y2="56"/>
      <line x1="56" y1="48" x2="56" y2="56"/>
      <line x1="10" y1="56" x2="60" y2="56"/>
    </svg>
  );
}

const CATEGORIES = [
  { slug: "watches",  labelEn: "Watches",          labelFr: "Montres",        labelAr: "ساعات",         Icon: WatchIcon },
  { slug: "jewellery",labelEn: "Jewellery",         labelFr: "Bijoux",         labelAr: "مجوهرات",       Icon: JewelleryIcon },
  { slug: "shipping", labelEn: "Delivery",          labelFr: "Livraison",      labelAr: "التوصيل",       Icon: TruckIcon },
  { slug: "account",  labelEn: "Customer Account",  labelFr: "Compte Client",  labelAr: "حساب العميل",   Icon: AccountIcon },
  { slug: "payment",  labelEn: "Payment",           labelFr: "Paiement",       labelAr: "الدفع",         Icon: PaymentIcon },
  { slug: "owner",    labelEn: "Owner",             labelFr: "Propriétaire",   labelAr: "المالك",        Icon: OwnerIcon },
];

function q(faq: Faq, locale: string) {
  return locale === "ar" ? faq.questionAr : locale === "en" ? faq.questionEn : faq.questionFr;
}
function a(faq: Faq, locale: string) {
  return locale === "ar" ? faq.answerAr : locale === "en" ? faq.answerEn : faq.answerFr;
}
function catLabel(cat: typeof CATEGORIES[0], locale: string) {
  return locale === "ar" ? cat.labelAr : locale === "en" ? cat.labelEn : cat.labelFr;
}

function Accordion({ faqs, locale }: { faqs: Faq[]; locale: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (faqs.length === 0)
    return (
      <p className="text-foreground/40 text-sm text-center py-8">
        {locale === "en" ? "No questions yet." : "Aucune question pour le moment."}
      </p>
    );

  return (
    <div className="divide-y divide-border border-t border-b border-border">
      {faqs.map((faq) => (
        <div key={faq.id}>
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
                openId === faq.id ? "rotate-180 text-[#5a5535]" : ""
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
        </div>
      ))}
    </div>
  );
}

export default function FaqPublicClient({
  popular,
  all,
  locale,
}: {
  popular: Faq[];
  all: Faq[];
  locale: string;
}) {
  const popularToShow = popular.length > 0 ? popular : all.slice(0, 5);

  return (
    <main className="min-h-screen bg-background">
      {/* ── HERO ── */}
      <section className="relative h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <Image
          src="/back1.png"
          alt="FAQ background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/50 mb-5">
              Support
            </p>
            <h1 className="luxury-heading text-4xl md:text-5xl lg:text-6xl font-light text-white mb-5">
              Frequently Asked Questions
            </h1>
            <p className="text-white/60 text-base md:text-lg tracking-wide">
              How may we help you today?
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section-padding py-20">
        <div className="max-w-5xl mx-auto">
          {/* Section title with divider lines */}
          <div className="flex items-center gap-5 mb-14">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-sm font-bold tracking-[0.25em] uppercase text-foreground/70 whitespace-nowrap">
              Questions by Category
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {CATEGORIES.map((cat, i) => {
              const { Icon } = cat;
              const label = catLabel(cat, locale);
              return (
                <motion.div
                  key={cat.slug}
                  className="w-[calc(50%-10px)] md:w-[calc(33.333%-14px)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/${locale}/faq/${cat.slug}`}
                    className="group flex flex-col items-center gap-6 bg-surface hover:bg-surface-2 transition-colors duration-300 rounded-sm p-8 pt-10 pb-8 text-center h-full"
                  >
                    <div className="w-40 h-40 rounded-full border border-foreground/30 group-hover:border-[#5a5535]/70 flex items-center justify-center p-9 transition-colors duration-300">
                      <div className="w-full h-full text-foreground/50 group-hover:text-[#5a5535] transition-colors duration-300">
                        <Icon />
                      </div>
                    </div>
                    <span className="text-sm font-bold tracking-wide text-foreground/65 group-hover:text-foreground transition-colors duration-300">
                      {label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Olive logo strip ── */}
      <div className="flex items-center justify-center" style={{ backgroundColor: "#4a5240", height: "56px" }}>
        <Image
          src="/logo.png"
          alt="Ziziwatches"
          width={700}
          height={110}
          className="object-contain brightness-0 invert"
          style={{ height: "110px", width: "auto" }}
        />
      </div>

      {/* ── POPULAR QUESTIONS ── */}
      <section className="section-padding py-16 bg-surface border-t border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/30 mb-3">Top</p>
            <h2 className="luxury-heading text-2xl md:text-3xl font-light text-foreground">
              Popular Questions
            </h2>
          </div>
          <Accordion faqs={popularToShow} locale={locale} />
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section className="section-padding py-20 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Title with divider lines */}
          <div className="flex items-center gap-5 mb-12">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-sm font-bold tracking-[0.25em] uppercase text-foreground/70 whitespace-nowrap">
              Didn&apos;t find what you were looking for?
            </h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp card */}
            <a
              href="https://wa.me/2126XXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-6 bg-surface rounded-2xl border border-border p-10 text-center hover:border-foreground/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <MessageCircle size={28} strokeWidth={1.5} className="text-foreground/60" />
                <span className="text-lg font-semibold text-foreground/80">Chat on WhatsApp</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/55 max-w-xs">
                {locale === "fr"
                  ? "Vous avez une question ? Notre équipe vous répond en quelques secondes, disponible 7j/7."
                  : "You have a question that can be answered in a few seconds? Our team will give you the right answer."}
              </p>
              <span className="mt-2 inline-block bg-foreground text-background text-sm font-semibold px-8 py-3 rounded-full group-hover:bg-[#5a5535] group-hover:text-white transition-colors duration-300">
                {locale === "fr" ? "Démarrer le chat" : "Start Chat"}
              </span>
            </a>

            {/* Contact form card */}
            <Link
              href={`/${locale}/contact`}
              className="group flex flex-col items-center gap-6 bg-surface rounded-2xl border border-border p-10 text-center hover:border-foreground/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <Mail size={28} strokeWidth={1.5} className="text-foreground/60" />
                <span className="text-lg font-semibold text-foreground/80">Service Form</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/55 max-w-xs">
                {locale === "fr"
                  ? "Besoin d'un conseil personnalisé ou d'aide pour un problème ? Utilisez le formulaire, nous vous répondrons rapidement."
                  : "Do you have another question, need individual advice or help with a problem? Simply use the service form, we will be happy to help you quickly!"}
              </p>
              <span className="mt-2 inline-block bg-foreground text-background text-sm font-semibold px-8 py-3 rounded-full group-hover:bg-[#5a5535] group-hover:text-white transition-colors duration-300">
                {locale === "fr" ? "Ouvrir le formulaire" : "Open Service Form"}
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* ── SPLIT: IMAGE + TEXT ── */}
      <section className="flex flex-col md:flex-row min-h-[480px]">
        {/* Image half */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto">
          <Image
            src="/back2.png"
            alt="We're here to help"
            fill
            className="object-cover"
          />
        </div>

        {/* Text half */}
        <div className="w-full md:w-1/2 bg-surface flex items-center px-10 py-16 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-md"
          >
            <h2 className="luxury-heading text-2xl md:text-3xl font-light text-foreground mb-6">
              We&apos;re Here to Help You
            </h2>
            <div className="w-10 h-px bg-[#5a5535] mb-8" />
            <p className="text-sm text-foreground/60 leading-relaxed mb-5">
              Our team is dedicated and passionate about bringing you the perfect timepiece as quickly as possible, while ensuring you&apos;re completely satisfied with your purchase.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-5">
              Our FAQ section is designed to give you clear insights into our products, materials, and ordering process, so you can shop with full confidence and peace of mind.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Still have questions after browsing our FAQ? Don&apos;t hesitate to reach out! Simply use our contact form, and our support team will be happy to assist you.
            </p>
          </motion.div>
        </div>
      </section>
      {/* ── OLIVE LOGO BAR ── */}
      <div
        className="flex items-center justify-center"
        style={{ background: "#4a5240", height: 56 }}
      >
        <Image
          src="/logo.png"
          alt="Ziziwatches"
          width={130}
          height={28}
          className="object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

    </main>
  );
}
