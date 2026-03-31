import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PROCESSING: "text-purple-400 bg-purple-400/10",
  SHIPPED: "text-cyan-400 bg-cyan-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: { select: { nameFr: true } } } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Commandes</h1>
          <p className="text-foreground/40 text-sm mt-1">{orders.length} commande(s) au total</p>
        </div>
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["Numéro", "Client", "Tel", "Produits", "Total", "Statut", "Date"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] text-foreground/30 uppercase tracking-widest font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-foreground/30 text-sm">
                  Aucune commande pour l'instant
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const address = JSON.parse(order.shippingAddress) as {
                  firstName: string;
                  lastName: string;
                  phone: string;
                  wilaya: string;
                };
                return (
                  <tr
                    key={order.id}
                    className="border-b border-border/50 hover:bg-background/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gold font-mono text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-foreground/70 text-sm">
                      {address.firstName} {address.lastName}
                      <br />
                      <span className="text-foreground/30 text-xs">{address.wilaya}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground/50 text-xs">{address.phone}</td>
                    <td className="px-4 py-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-foreground/60 text-xs">
                          {item.productName} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-foreground/80 text-sm font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium ${
                          STATUS_COLORS[order.status] ?? "text-foreground/50"
                        }`}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground/40 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("fr-DZ")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
