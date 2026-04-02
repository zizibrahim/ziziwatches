import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { total: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Clients</h1>
        <p className="text-foreground/40 text-sm mt-1">{customers.length} client{customers.length !== 1 ? "s" : ""}</p>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">Aucun client enregistré.</div>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => {
            const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0);
            const delivered = customer.orders.filter((o) => o.status === "DELIVERED").length;
            return (
              <div key={customer.id} className="bg-surface border border-border p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <span className="text-gold text-sm font-medium">
                      {customer.name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{customer.name ?? "—"}</p>
                    <p className="text-foreground/40 text-xs truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 shrink-0 text-right">
                  <div>
                    <p className="text-foreground/80 text-sm font-medium">{customer.orders.length}</p>
                    <p className="text-foreground/30 text-xs">commandes</p>
                  </div>
                  <div>
                    <p className="text-green-400 text-sm font-medium">{delivered}</p>
                    <p className="text-foreground/30 text-xs">livrées</p>
                  </div>
                  <div>
                    <p className="text-gold text-sm font-medium">{formatPrice(totalSpent)}</p>
                    <p className="text-foreground/30 text-xs">dépensé</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-foreground/40 text-xs">
                      {format(new Date(customer.createdAt), "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
