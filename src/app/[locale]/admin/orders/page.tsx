import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "En attente",      color: "text-yellow-400 bg-yellow-400/10" },
  CONFIRMED:  { label: "Confirmée",       color: "text-blue-400 bg-blue-400/10" },
  PROCESSING: { label: "En préparation",  color: "text-purple-400 bg-purple-400/10" },
  SHIPPED:    { label: "Expédiée",        color: "text-orange-400 bg-orange-400/10" },
  DELIVERED:  { label: "Livrée",          color: "text-green-400 bg-green-400/10" },
  CANCELLED:  { label: "Annulée",         color: "text-red-400 bg-red-400/10" },
  RETURNED:   { label: "Retournée",       color: "text-foreground/40 bg-foreground/5" },
};

const ALL_STATUSES = Object.keys(STATUS_META);

interface Props {
  params: { locale: string };
  searchParams: { status?: string };
}

export default async function AdminOrdersPage({ params, searchParams }: Props) {
  const filterStatus = searchParams.status?.toUpperCase();
  const where = filterStatus && ALL_STATUSES.includes(filterStatus) ? { status: filterStatus } : {};

  const [orders, counts] = await Promise.all([
    prisma.order.findMany({ where, include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]));
  const total = counts.reduce((s, c) => s + c._count._all, 0);

  return (
    <div>
      <div className="mb-6">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Commandes</h1>
        <p className="text-foreground/40 text-sm mt-1">{total} commande{total !== 1 ? "s" : ""} au total</p>
      </div>

      <div className="flex overflow-x-auto gap-2 pb-2 mb-6 -mx-1 px-1">
        <Link href={`/${params.locale}/admin/orders`}
          className={`shrink-0 text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${!filterStatus ? "border-gold text-gold bg-gold/5" : "border-border text-foreground/40 hover:text-foreground/70"}`}>
          Toutes ({total})
        </Link>
        {ALL_STATUSES.map((s) => {
          const meta = STATUS_META[s];
          const count = countMap[s] ?? 0;
          if (count === 0 && filterStatus !== s) return null;
          return (
            <Link key={s} href={`/${params.locale}/admin/orders?status=${s.toLowerCase()}`}
              className={`shrink-0 text-xs tracking-wider uppercase px-3 py-1.5 border transition-colors ${filterStatus === s ? "border-gold text-gold bg-gold/5" : "border-border text-foreground/40 hover:text-foreground/70"}`}>
              {meta.label}{count > 0 ? ` (${count})` : ""}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border">
          <p className="text-foreground/30 text-sm">Aucune commande{filterStatus ? " avec ce statut" : ""}.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const shipping = JSON.parse(order.shippingAddress) as { firstName: string; lastName: string; phone: string; wilaya: string; city: string };
            const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
            return (
              <Link key={order.id} href={`/${params.locale}/admin/orders/${order.id}`}
                className="block bg-surface border border-border p-4 hover:border-gold/30 transition-colors group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-foreground font-mono text-sm">{order.orderNumber}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    </div>
                    <p className="text-foreground/70 text-sm font-medium">{shipping.firstName} {shipping.lastName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-foreground/40 text-xs font-mono">{shipping.phone}</span>
                      <span className="text-foreground/30 text-xs">·</span>
                      <span className="text-foreground/40 text-xs">{shipping.city}, {shipping.wilaya}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {order.items.map((item) => (
                        <span key={item.id} className="text-xs text-foreground/30 bg-background border border-border/50 px-2 py-0.5">
                          {item.productName} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-4 shrink-0">
                    <span className="text-gold font-semibold">{formatPrice(order.total)}</span>
                    <span className="text-foreground/25 text-xs">{format(new Date(order.createdAt), "d MMM yyyy", { locale: fr })}</span>
                    <ArrowRight size={14} className="text-foreground/20 group-hover:text-gold transition-colors hidden sm:block" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
