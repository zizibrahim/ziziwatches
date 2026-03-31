"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "ع",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 text-xs font-medium tracking-wider uppercase transition-colors duration-200 ${
            locale === l
              ? "text-gold border-b border-gold"
              : "text-foreground/50 hover:text-foreground/80"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
