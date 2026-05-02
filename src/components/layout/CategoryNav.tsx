"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type DropItem = { label: string; href: string };
type Column  = { heading?: string; items: DropItem[] };
type NavItem = { label: string; href: string; columns: Column[] };

function buildNav(locale: string): NavItem[] {
  const s = (q: string) => `/${locale}/shop${q}`;
  return [
    {
      label: "Homme",
      href: `/${locale}/men`,
      columns: [{
        items: [
          { label: "Watches",       href: `/${locale}/watches?gender=homme` },
          { label: "Jewellery",     href: `/${locale}/jewellery?gender=homme` },
          { label: "Bestsellers",   href: `/${locale}/bestsellers/men` },
          { label: "Gifts for him", href: `/${locale}/gifts` },
          { label: "Pack",          href: `/${locale}/packs?gender=homme` },
        ],
      }],
    },
    {
      label: "Femme",
      href: `/${locale}/women`,
      columns: [{
        items: [
          { label: "Watches",       href: `/${locale}/watches?gender=femme` },
          { label: "Jewellery",     href: `/${locale}/jewellery?gender=femme` },
          { label: "Bestsellers",   href: `/${locale}/bestsellers/women` },
          { label: "Gifts for her", href: `/${locale}/gifts` },
          { label: "Pack",          href: `/${locale}/packs?gender=femme` },
        ],
      }],
    },
    {
      label: "Montres",
      href: `/${locale}/watches`,
      columns: [
        {
          heading: "Women's Watches",
          items: [
            { label: "Show all",     href: `/${locale}/watches?gender=femme` },
            { label: "New arrivals", href: `/${locale}/watches?gender=femme&sort=newest` },
            { label: "Bestsellers",  href: `/${locale}/bestsellers/women` },
          ],
        },
        {
          heading: "Men's Watches",
          items: [
            { label: "Show all",     href: `/${locale}/watches?gender=homme` },
            { label: "New arrivals", href: `/${locale}/watches?gender=homme&sort=newest` },
            { label: "Bestsellers",  href: `/${locale}/bestsellers/men` },
          ],
        },
      ],
    },
    {
      label: "Accessoires",
      href: `/${locale}/jewellery`,
      columns: [{
        items: [
          { label: "Women's Jewellery", href: `/${locale}/jewellery` },
          { label: "Men's Jewellery",   href: `/${locale}/jewellery` },
          { label: "Bestsellers",       href: `/${locale}/bestsellers/accessoires` },
        ],
      }],
    },
    {
      label: "Pack",
      href: `/${locale}/packs`,
      columns: [{
        items: [
          { label: "Femme",   href: `/${locale}/packs?gender=femme` },
          { label: "Homme",   href: `/${locale}/packs?gender=homme` },
          { label: "Couples", href: `/${locale}/packs?gender=couple` },
        ],
      }],
    },
    {
      label: "Cadeau",
      href: `/${locale}/gifts`,
      columns: [{
        items: [
          { label: "Selected gifts",    href: `/${locale}/gifts` },
          { label: "Gifts for Him",     href: `/${locale}/gifts` },
          { label: "Gifts for Her",     href: `/${locale}/gifts` },
          { label: "Wedding Gifts",     href: `/${locale}/gifts` },
          { label: "Birthday Gifts",    href: `/${locale}/gifts` },
          { label: "Anniversary Gifts", href: `/${locale}/gifts` },
          { label: "Gift Cards",        href: `/${locale}/gifts` },
        ],
      }],
    },
  ];
}

export default function CategoryNav() {
  const locale = useLocale();
  const [open, setOpen] = useState<string | null>(null);
  const navItems = buildNav(locale);
  const activeItem = navItems.find((n) => n.label === open);

  return (
    <div
      className="hidden lg:block fixed top-20 left-0 right-0 z-40"
      onMouseLeave={() => setOpen(null)}
    >
      {/* Nav bar */}
      <nav className="bg-background border-b border-border">
        <div className="section-padding py-0">
          <div className="flex items-center justify-center gap-8 xl:gap-14">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpen(item.columns.length > 0 ? item.label : null)}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(null)}
                  className={`relative block py-4 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 whitespace-nowrap
                    ${open === item.label ? "text-foreground" : "text-foreground/55 hover:text-foreground"}`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-olive transition-transform duration-200 origin-center
                      ${open === item.label ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mega-menu panel */}
      <AnimatePresence>
        {open && activeItem && activeItem.columns.length > 0 && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="bg-background border-b border-border shadow-md"
          >
            <div className="section-padding py-8">
              <div className="flex justify-center gap-16">
                {activeItem.columns.map((col, ci) => (
                  <div key={ci} className="min-w-[160px]">
                    {col.heading && (
                      <p className="text-[9px] tracking-[0.4em] uppercase text-olive font-semibold mb-4 pb-2 border-b border-olive/20">
                        {col.heading}
                      </p>
                    )}
                    <ul className="space-y-3">
                      {col.items.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(null)}
                            className="text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-150"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
