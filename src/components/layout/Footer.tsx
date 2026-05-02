import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Instagram, Facebook, Mail } from "lucide-react";

const OLIVE = "#4a5240";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer style={{ background: "#f0f0f0" }}>
      <div className="section-padding pt-14 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ── Col 1: Brand ── */}
          <div className="flex flex-col items-start gap-4">
            <Image
              src="/logo.png"
              alt="Ziziwatches"
              width={160}
              height={52}
              className="object-contain"
            />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              L&apos;art du temps, porté avec élégance.
            </p>

            <div className="flex gap-5 items-center">
              <a href="https://www.instagram.com/ziziwatches/" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" aria-label="Instagram">
                <Instagram size={26} color={OLIVE} />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61574343201314" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" aria-label="Facebook">
                <Facebook size={26} color={OLIVE} />
              </a>
              <a href="https://www.tiktok.com/@ziziwatches?lang=fr" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" aria-label="TikTok">
                <svg width="26" height="26" viewBox="0 0 24 24" fill={OLIVE}>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
              <a href="mailto:contact@ziziwatches.com"
                className="transition-opacity hover:opacity-60" aria-label="Email">
                <Mail size={26} color={OLIVE} />
              </a>
              <a href="https://wa.me/213600000000" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" aria-label="WhatsApp">
                <svg width="26" height="26" viewBox="0 0 24 24" fill={OLIVE}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Col 2: Shop ── */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4" style={{ color: OLIVE }}>
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Montres Homme", slug: "montres-homme" },
                { label: "Montres Femme", slug: "montres-femme" },
                { label: "Bijoux Femme",  slug: "bijoux-femme"  },
                { label: "Bijoux Homme",  slug: "bijoux-homme"  },
                { label: "Packs",         slug: "packs"         },
                { label: "Cadeaux",       slug: "cadeaux"       },
              ].map(({ label, slug }) => (
                <li key={slug}>
                  <Link href={`/${locale}/shop?category=${slug}`}
                    className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Company ── */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4" style={{ color: OLIVE }}>
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/about`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Notre histoire
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cgv`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Col 4: Help ── */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-4" style={{ color: OLIVE }}>
              Help
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cart`} className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-gray-200 mt-12 pt-4 text-center">
          <p className="text-gray-400 text-xs tracking-wider">
            © {new Date().getFullYear()} Ziziwatches. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
