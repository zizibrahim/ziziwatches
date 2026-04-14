import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="luxury-heading text-xl tracking-[0.3em] uppercase text-foreground">
              ZIZI<span className="gold-text">WATCHES</span>
            </span>
            <p className="mt-4 text-foreground/40 text-sm leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-foreground/40 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-foreground/40 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-foreground/40 hover:text-gold transition-colors"
                aria-label="TikTok"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-4 font-medium">
              {t("shop")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cart`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-gold mb-4 font-medium">
              {t("legal")}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cgv`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-6 text-center">
          <p className="text-foreground/30 text-xs tracking-wider">
            © {new Date().getFullYear()} Ziziwatches. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
