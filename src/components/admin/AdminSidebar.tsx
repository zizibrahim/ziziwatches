"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogout from "./AdminLogout";
import {
  LayoutDashboard, ShoppingBag, Package, Users,
  LogOut, Menu, X, HelpCircle, Tag, Settings, Star, Crown, Trophy, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/products", label: "Produits", icon: Package },
  { href: "/bestsellers", label: "Bestsellers", icon: Trophy },
  { href: "/new-arrivals", label: "Nouveautés", icon: Sparkles },
  { href: "/categories", label: "Catégories", icon: Tag },
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/vip", label: "Membres VIP", icon: Crown },
  { href: "/reviews", label: "Avis clients", icon: Star },
  { href: "/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

function SidebarContent({
  locale,
  onClose,
  pendingOrders,
}: {
  locale: string;
  onClose?: () => void;
  pendingOrders: number;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <Link href={`/${locale}`} onClick={onClose}>
          <span className="luxury-heading text-sm tracking-[0.3em] uppercase text-foreground">
            ZIZI<span className="gold-text">WATCHES</span>
          </span>
          <p className="text-foreground/30 text-[10px] tracking-widest uppercase mt-1">Admin</p>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const href = `/${locale}/admin${item.href}`;
          const active = item.href === ""
            ? pathname === `/${locale}/admin`
            : pathname.startsWith(href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs transition-colors group rounded-sm ${
                active
                  ? "text-gold bg-gold/5 border-l-2 border-gold pl-[10px]"
                  : "text-foreground/50 hover:text-foreground hover:bg-surface border-l-2 border-transparent pl-[10px]"
              }`}
            >
              <Icon size={15} strokeWidth={1.5} className={active ? "text-gold" : "group-hover:text-gold transition-colors"} />
              <span className="flex-1">{item.label}</span>
              {item.href === "/orders" && pendingOrders > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <Link
          href={`/${locale}`}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
        >
          <LogOut size={14} />
          Voir la boutique
        </Link>
        <AdminLogout locale={locale} />
      </div>
    </div>
  );
}

export default function AdminSidebar({ locale, pendingOrders }: { locale: string; pendingOrders: number }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 bg-surface border-r border-border flex-col">
        <SidebarContent locale={locale} pendingOrders={pendingOrders} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-border flex items-center justify-between px-4 h-14">
        <Link href={`/${locale}`}>
          <span className="luxury-heading text-sm tracking-[0.3em] uppercase text-foreground">
            ZIZI<span className="gold-text">WATCHES</span>
          </span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="text-foreground/60 hover:text-foreground p-1">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-surface border-r border-border flex flex-col"
            >
              <SidebarContent locale={locale} pendingOrders={pendingOrders} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
