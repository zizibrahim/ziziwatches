"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ShoppingBag, Menu, X, Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import CategoryNav from "./CategoryNav";
import AccountModal from "./AccountModal";
import ProfileSetupModal from "./ProfileSetupModal";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("header");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profileSetupOpen, setProfileSetupOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("zw_profile");
      if (stored) setProfile(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setAboutOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/${locale}?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const aboutLinks = [
    { href: `/${locale}/about`, label: t("story") },
    { href: `/${locale}/suivi`, label: t("trackOrder") },
    { href: `/${locale}/faq`, label: t("faq") },
    { href: `/${locale}/reviews`, label: t("reviews") },
    { href: `/${locale}/privacy`, label: t("privacy") },
    { href: `/${locale}/cgv`, label: t("cgv") },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-500">
        <div className="section-padding">
          {/* Main header row */}
          <div className="flex items-center justify-between h-20">
            {/* Left: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {/* About us dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-foreground transition-colors duration-300 font-medium whitespace-nowrap">
                  {t("aboutUs")}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 bg-background border border-border shadow-lg min-w-[180px] py-2 z-50"
                    >
                      <div className="absolute -top-[6px] left-4 w-3 h-3 bg-background border-l border-t border-border rotate-45" />
                      {aboutLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-5 py-2.5 text-xs tracking-[0.15em] uppercase text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors duration-150"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Center: Logo */}
            <Link href={`/${locale}`} className="flex items-center shrink-0 absolute left-1/2 transform -translate-x-1/2">
              <Image
                src="/logo.png"
                alt="Ziziwatches"
                width={400}
                height={150}
                className="h-20 sm:h-24 lg:h-28 w-auto object-contain brightness-0 dark:invert"
                priority
              />
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 shrink-0 ml-auto">
              {/* Search */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-foreground/60 hover:text-foreground transition-colors p-2"
                  aria-label={t("search")}
                >
                  <Search size={22} strokeWidth={1.5} />
                </button>
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("search")}</span>
              </div>

              {/* Language */}
              <div className="flex flex-col items-center gap-1">
                <LanguageSwitcher />
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("language")}</span>
              </div>

              {/* Account */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => profile ? setAccountOpen(true) : setProfileSetupOpen(true)}
                  className="text-foreground/60 hover:text-foreground transition-colors p-2"
                  aria-label={t("account")}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("account")}</span>
              </div>

              {/* Cart */}
              <div className="flex flex-col items-center gap-1">
                <Link
                  href={`/${locale}/cart`}
                  className="relative text-foreground/60 hover:text-foreground transition-colors p-2"
                >
                  <ShoppingBag size={22} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-foreground text-background text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{t("cart")}</span>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-foreground/60 hover:text-foreground transition-colors p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border/50"
            >
              <form onSubmit={handleSearch} className="section-padding py-4 flex items-center gap-4">
                <Search size={15} className="text-foreground/40 shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 bg-transparent text-foreground text-sm placeholder:text-foreground/25 focus:outline-none tracking-wide"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => setSearchValue("")}
                    className="text-foreground/30 hover:text-foreground transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-7 px-8 pt-20"
          >
            <button
              className="absolute top-5 right-5 text-foreground/60 hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>

            {aboutLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg font-light tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/cart`}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-light tracking-[0.2em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              {t("cart")} {cartCount > 0 && `(${cartCount})`}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Navigation */}
      <CategoryNav />

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        open={profileSetupOpen}
        onSave={(p) => { setProfile(p); setProfileSetupOpen(false); setAccountOpen(true); }}
        onClose={() => setProfileSetupOpen(false)}
      />

      {/* Account Modal */}
      <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} profile={profile} />
    </>
  );
}
