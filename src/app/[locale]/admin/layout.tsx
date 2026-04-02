import Link from "next/link";
import SessionProvider from "@/components/layout/SessionProvider";
import AdminLogout from "@/components/admin/AdminLogout";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Briefcase,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: ".", label: "Dashboard", icon: LayoutDashboard },
  { href: "orders", label: "Commandes", icon: ShoppingBag },
  { href: "products", label: "Produits", icon: Package },
  { href: "customers", label: "Clients", icon: Users },
  { href: "projects", label: "Projets", icon: Briefcase },
];

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <SessionProvider>
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <Link href={`/${params.locale}`}>
            <span className="luxury-heading text-sm tracking-[0.3em] uppercase text-foreground">
              ZIZI<span className="gold-text">WATCHES</span>
            </span>
          </Link>
          <p className="text-foreground/30 text-[10px] tracking-widest uppercase mt-1">
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={`/${params.locale}/admin${item.href === "." ? "" : `/${item.href}`}`}
                className="flex items-center gap-3 px-3 py-2 text-xs text-foreground/50 hover:text-foreground hover:bg-surface transition-colors group"
              >
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  className="group-hover:text-gold transition-colors"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border space-y-1">
          <Link
            href={`/${params.locale}`}
            className="flex items-center gap-3 px-3 py-2 text-xs text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <LogOut size={14} />
            Voir la boutique
          </Link>
          <AdminLogout locale={params.locale} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
    </SessionProvider>
  );
}
