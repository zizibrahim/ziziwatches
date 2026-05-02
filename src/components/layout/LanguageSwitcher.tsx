"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

const FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  ar: "🇲🇦",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors p-2 rounded"
        aria-label="Language"
      >
        <Globe size={22} strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-background border border-border rounded shadow-lg z-40"
            onClick={(e) => e.stopPropagation()}
          >
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => switchLocale(l)}
                className={`w-full px-4 py-3 text-sm font-medium tracking-wide uppercase transition-colors flex items-center gap-3 hover:bg-foreground/5 ${
                  locale === l ? "text-foreground bg-foreground/3" : "text-foreground/70"
                }`}
              >
                <span className="text-lg">{FLAGS[l]}</span>
                {LABELS[l]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
