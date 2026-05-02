import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import NewArrivalToggle from "@/components/admin/NewArrivalToggle";

export const dynamic = "force-dynamic";

const TABS = [
  { label: "Tous",    slug: null },
  { label: "Montres", slug: "montres" },
  { label: "Bijoux",  slug: "bijoux" },
  { label: "Packs",   slug: "packs" },
  { label: "Cadeaux", slug: "cadeaux" },
] as const;

interface PageProps {
  params: { locale: string };
  searchParams: { cat?: string };
}

export default async function AdminNewArrivalsPage({ params, searchParams }: PageProps) {
  const activeCat = searchParams.cat ?? null;

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(activeCat ? { category: { slug: activeCat } } : {}),
    },
    include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    orderBy: [{ isNew: "desc" }, { nameFr: "asc" }],
  });

  const newArrivals = products.filter((p) => p.isNew);
  const rest        = products.filter((p) => !p.isNew);
  const locale      = params.locale;

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-1">Admin</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground flex items-center gap-3">
          <Sparkles size={26} className="text-olive" />
          Nouveautés
        </h1>
        <p className="text-foreground/40 text-sm mt-1">
          {newArrivals.length} produit{newArrivals.length !== 1 ? "s" : ""} marqué{newArrivals.length !== 1 ? "s" : ""} comme nouveauté
          {activeCat ? ` dans "${TABS.find(t => t.slug === activeCat)?.label}"` : ""}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap mb-8 border-b border-border pb-0">
        {TABS.map((tab) => {
          const isActive = (tab.slug ?? "") === (activeCat ?? "");
          const href = tab.slug
            ? `/${locale}/admin/new-arrivals?cat=${tab.slug}`
            : `/${locale}/admin/new-arrivals`;
          return (
            <a
              key={tab.label}
              href={href}
              className={`px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                isActive
                  ? "border-olive text-olive"
                  : "border-transparent text-foreground/40 hover:text-foreground"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* Active new arrivals */}
      {newArrivals.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-olive" />
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">
              Nouveautés actives — {newArrivals.length}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} highlighted />)}
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 border-t border-border" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/25">
          {rest.length} autre{rest.length !== 1 ? "s" : ""} produit{rest.length !== 1 ? "s" : ""}
        </span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* Rest */}
      {rest.length === 0 ? (
        <div className="border border-dashed border-border py-10 text-center">
          <p className="text-foreground/25 text-sm">Tous les produits sont déjà marqués comme nouveautés.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {rest.map((p) => <ProductCard key={p.id} product={p} highlighted={false} />)}
        </div>
      )}
    </div>
  );
}

type Product = {
  id: string;
  nameFr: string;
  sku: string;
  price: number;
  stock: number;
  isNew: boolean;
  images: { url: string }[];
  category: { nameFr: string } | null;
};

function ProductCard({ product, highlighted }: { product: Product; highlighted: boolean }) {
  const img = product.images[0]?.url;
  return (
    <div className={`flex items-center gap-3 p-3 border transition-colors ${
      highlighted ? "border-olive/30 bg-olive/5" : "border-border bg-surface"
    }`}>
      <div className="w-12 h-12 shrink-0 bg-background border border-border overflow-hidden">
        {img ? (
          <Image src={img} alt={product.nameFr} width={48} height={48} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">?</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium truncate">{product.nameFr}</p>
        <p className="text-foreground/40 text-xs font-mono mt-0.5">
          {product.sku}{product.category ? ` · ${product.category.nameFr}` : ""}
        </p>
      </div>
      <p className="text-olive text-sm font-medium shrink-0">{formatPrice(product.price)}</p>
      <NewArrivalToggle productId={product.id} isNew={product.isNew} />
    </div>
  );
}
