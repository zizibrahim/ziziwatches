import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, TrendingUp, Users, Package } from "lucide-react";

export default async function AdminDashboard() {
  const [orderCount, totalRevenueResult, customerCount, productCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { take: 1 } },
      }),
    ]);

  const totalRevenue = totalRevenueResult._sum.total ?? 0;

  const stats = [
    {
      label: "Commandes",
      value: orderCount.toString(),
      icon: ShoppingBag,
      color: "text-blue-400",
    },
    {
      label: "Chiffre d'affaires",
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: "text-gold",
    },
    {
      label: "Clients",
      value: customerCount.toString(),
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Produits actifs",
      value: productCount.toString(),
      icon: Package,
      color: "text-green-400",
    },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-400 bg-yellow-400/10",
    CONFIRMED: "text-blue-400 bg-blue-400/10",
    PROCESSING: "text-purple-400 bg-purple-400/10",
    SHIPPED: "text-cyan-400 bg-cyan-400/10",
    DELIVERED: "text-green-400 bg-green-400/10",
    CANCELLED: "text-red-400 bg-red-400/10",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PROCESSING: "En traitement",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="luxury-heading text-3xl font-light text-foreground">Dashboard</h1>
        <p className="text-foreground/40 text-sm mt-1">Vue d'ensemble de Ziziwatches</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-foreground/40 text-xs uppercase tracking-wider">
                  {stat.label}
                </p>
                <Icon size={16} className={stat.color} strokeWidth={1.5} />
              </div>
              <p className="text-foreground text-xl font-light luxury-heading">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-surface border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-foreground/80 text-sm font-medium tracking-wider uppercase">
            Commandes récentes
          </h2>
          <a
            href="admin/orders"
            className="text-gold text-xs hover:text-gold-light transition-colors"
          >
            Voir tout →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Numéro", "Client", "Total", "Statut", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] text-foreground/30 uppercase tracking-widest font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/30 text-sm">
                    Aucune commande pour l'instant
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const address = JSON.parse(order.shippingAddress) as {
                    firstName: string;
                    lastName: string;
                    phone: string;
                  };
                  return (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 text-gold font-mono text-xs">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 text-foreground/70 text-sm">
                        {address.firstName} {address.lastName}
                      </td>
                      <td className="px-6 py-4 text-foreground/80 text-sm">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium ${
                            statusColors[order.status] ?? "text-foreground/50"
                          }`}
                        >
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/40 text-xs">
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
    </div>
  );
}
