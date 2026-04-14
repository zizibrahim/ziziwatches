import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({ params }: { params: { locale: string } }) {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  // Group orders by phone number — each unique phone = one customer
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email: string;
    city: string;
    wilaya: string;
    orders: typeof orders;
    firstOrder: Date;
    lastOrder: Date;
  }>();

  for (const order of orders) {
    const shipping = JSON.parse(order.shippingAddress) as {
      firstName: string; lastName: string; phone: string;
      email?: string; city: string; wilaya: string;
    };
    const phone = shipping.phone;

    if (!customerMap.has(phone)) {
      customerMap.set(phone, {
        name: `${shipping.firstName} ${shipping.lastName}`,
        phone,
        email: shipping.email ?? "",
        city: shipping.city,
        wilaya: shipping.wilaya,
        orders: [],
        firstOrder: new Date(order.createdAt),
        lastOrder: new Date(order.createdAt),
      });
    }

    const customer = customerMap.get(phone)!;
    customer.orders.push(order);
    const orderDate = new Date(order.createdAt);
    if (orderDate < customer.firstOrder) customer.firstOrder = orderDate;
    if (orderDate > customer.lastOrder) customer.lastOrder = orderDate;
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.lastOrder.getTime() - a.lastOrder.getTime()
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Clients</h1>
        <p className="text-foreground/40 text-sm mt-1">
          {customers.length} client{customers.length !== 1 ? "s" : ""} · {orders.length} commande{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border">
          <p className="text-foreground/30 text-sm">Aucune commande pour le moment.</p>
          <p className="text-foreground/20 text-xs mt-2">Les clients apparaîtront ici dès qu'une commande sera passée.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {customers.map((customer) => {
            const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0);
            const delivered = customer.orders.filter((o) => o.status === "DELIVERED").length;
            const pending = customer.orders.filter((o) => o.status === "PENDING").length;
            const initial = customer.name.trim()[0]?.toUpperCase() ?? "?";

            return (
              <div key={customer.phone} className="bg-surface border border-border p-4 hover:border-gold/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Identity */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                      <span className="text-gold text-sm font-medium">{initial}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium">{customer.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <a href={`tel:${customer.phone}`} className="text-foreground/50 text-xs font-mono hover:text-gold transition-colors">
                          {customer.phone}
                        </a>
                        {customer.email && (
                          <>
                            <span className="text-foreground/20 text-xs">·</span>
                            <a href={`mailto:${customer.email}`} className="text-foreground/40 text-xs hover:text-gold transition-colors truncate">
                              {customer.email}
                            </a>
                          </>
                        )}
                      </div>
                      <p className="text-foreground/30 text-xs mt-0.5">{customer.city}, {customer.wilaya}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 shrink-0 text-right pl-14 sm:pl-0">
                    <div>
                      <p className="text-foreground/80 text-sm font-medium">{customer.orders.length}</p>
                      <p className="text-foreground/30 text-[11px]">commandes</p>
                    </div>
                    {delivered > 0 && (
                      <div>
                        <p className="text-green-400 text-sm font-medium">{delivered}</p>
                        <p className="text-foreground/30 text-[11px]">livrées</p>
                      </div>
                    )}
                    {pending > 0 && (
                      <div>
                        <p className="text-yellow-400 text-sm font-medium">{pending}</p>
                        <p className="text-foreground/30 text-[11px]">en attente</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gold text-sm font-medium">{formatPrice(totalSpent)}</p>
                      <p className="text-foreground/30 text-[11px]">total dépensé</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-foreground/40 text-xs">
                        {format(customer.lastOrder, "d MMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-foreground/20 text-[11px]">dernière commande</p>
                    </div>
                  </div>
                </div>

                {/* Orders list */}
                {customer.orders.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2 pl-14">
                    {customer.orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/${params.locale}/admin/orders/${order.id}`}
                        className="text-[11px] font-mono text-foreground/40 hover:text-gold transition-colors border border-border/50 hover:border-gold/30 px-2 py-0.5"
                      >
                        {order.orderNumber}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
