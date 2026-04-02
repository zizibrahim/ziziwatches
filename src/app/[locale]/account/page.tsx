import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "text-yellow-400",
  CONFIRMED: "text-blue-400",
  PROCESSING: "text-purple-400",
  SHIPPED: "text-orange-400",
  DELIVERED: "text-green-400",
  CANCELLED: "text-red-400",
};

export default async function AccountPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${params.locale}/auth/login`);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) redirect(`/${params.locale}/auth/login`);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 section-padding pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Mon compte</p>
            <h1 className="luxury-heading text-4xl font-light text-foreground">
              Bonjour, {user.name?.split(" ")[0]}
            </h1>
            <p className="text-foreground/40 text-sm mt-1">{user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Commandes", value: user.orders.length },
              { label: "Livrées", value: user.orders.filter((o) => o.status === "DELIVERED").length },
              { label: "En cours", value: user.orders.filter((o) => !["DELIVERED", "CANCELLED"].includes(o.status)).length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface border border-border p-5 text-center">
                <p className="luxury-heading text-3xl font-light text-gold">{value}</p>
                <p className="text-foreground/40 text-xs tracking-wider uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Orders list */}
          <div>
            <h2 className="text-foreground/60 text-xs tracking-widest uppercase mb-4">
              Mes commandes
            </h2>
            {user.orders.length === 0 ? (
              <div className="text-center py-16 bg-surface border border-border">
                <p className="text-foreground/30 mb-4">Aucune commande pour le moment.</p>
                <Link href={`/${params.locale}/shop`} className="btn-outline text-sm px-6 py-2">
                  Découvrir la collection
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {user.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/${params.locale}/orders/${order.orderNumber}`}
                    className="block bg-surface border border-border p-4 hover:border-gold/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-foreground font-mono text-sm group-hover:text-gold transition-colors">
                        {order.orderNumber}
                      </span>
                      <span className={`text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-foreground/40 text-xs">
                        {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-gold text-sm font-medium">{formatPrice(order.total)}</span>
                        <span className="text-foreground/30 text-xs">
                          {format(new Date(order.createdAt), "d MMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
