import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10",
    CONFIRMED: "text-blue-400 bg-blue-400/10",
    PROCESSING: "text-purple-400 bg-purple-400/10",
    SHIPPED: "text-orange-400 bg-orange-400/10",
    DELIVERED: "text-green-400 bg-green-400/10",
    CANCELLED: "text-red-400 bg-red-400/10",
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Commandes</h1>
        <p className="text-foreground/40 text-sm mt-1">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-foreground/30">Aucune commande pour le moment.</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const shipping = JSON.parse(order.shippingAddress) as {
              firstName: string; lastName: string; phone: string; wilaya: string;
            };
            return (
              <div key={order.id} className="bg-surface border border-border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-foreground font-mono text-sm">{order.orderNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-foreground/70 text-sm">
                      {shipping.firstName} {shipping.lastName} — {shipping.wilaya}
                    </p>
                    <p className="text-foreground/40 text-xs font-mono mt-1">{shipping.phone}</p>
                    <p className="text-foreground/30 text-xs mt-1">
                      {format(new Date(order.createdAt), "d MMM yyyy HH:mm", { locale: fr })}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {order.items.map((item) => (
                        <span key={item.id} className="text-xs text-foreground/40 bg-background border border-border px-2 py-0.5">
                          {item.productName} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-gold font-medium">{formatPrice(order.total)}</span>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
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
