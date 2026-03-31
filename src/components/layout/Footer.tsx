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
                  href="#"
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/50 hover:text-foreground text-sm transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/30 text-xs tracking-wider">
            © {new Date().getFullYear()} Ziziwatches. {t("rights")}.
          </p>
          <p className="text-foreground/20 text-xs">Algérie</p>
        </div>
      </div>
    </footer>
  );
}
