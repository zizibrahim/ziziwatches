import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderDetailClient from "@/components/admin/OrderDetailClient";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string; locale: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  const shipping = JSON.parse(order.shippingAddress) as {
    firstName: string; lastName: string; phone: string;
    email?: string; street: string; city: string; wilaya: string;
  };

  return (
    <div>
      {/* Back */}
      <Link
        href={`/${params.locale}/admin/orders`}
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-foreground text-xs tracking-wider uppercase transition-colors mb-6"
      >
        <ArrowLeft size={13} /> Retour aux commandes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Commande</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">{order.orderNumber}</h1>
          <p className="text-foreground/40 text-sm mt-1">
            {format(new Date(order.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
          </p>
        </div>
        <OrderDetailClient
          orderId={order.id}
          currentStatus={order.status}
          currentNotes={order.notes ?? ""}
          phone={shipping.phone}
          orderNumber={order.orderNumber}
          locale={params.locale}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — Customer + Address */}
        <div className="lg:col-span-1 space-y-4">

          {/* Customer info */}
          <div className="bg-surface border border-border p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">Client</p>
            <div className="space-y-2.5">
              <div>
                <p className="text-foreground/30 text-[10px] uppercase tracking-wider">Nom</p>
                <p className="text-foreground text-sm">{shipping.firstName} {shipping.lastName}</p>
              </div>
              <div>
                <p className="text-foreground/30 text-[10px] uppercase tracking-wider">Téléphone</p>
                <a href={`tel:${shipping.phone}`} className="text-foreground text-sm hover:text-gold transition-colors font-mono">
                  {shipping.phone}
                </a>
              </div>
              {shipping.email && (
                <div>
                  <p className="text-foreground/30 text-[10px] uppercase tracking-wider">Email</p>
                  <a href={`mailto:${shipping.email}`} className="text-foreground/70 text-sm hover:text-gold transition-colors">
                    {shipping.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Delivery address */}
          <div className="bg-surface border border-border p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">Adresse de livraison</p>
            <div className="space-y-1 text-sm text-foreground/70 leading-relaxed">
              <p>{shipping.street}</p>
              <p>{shipping.city}</p>
              <p>{shipping.wilaya}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-surface border border-border p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3">Paiement</p>
            <p className="text-foreground/70 text-sm">Paiement à la livraison (espèces)</p>
            <p className="text-gold font-medium text-lg mt-1">{formatPrice(order.total)}</p>
          </div>
        </div>

        {/* Right — Items + Notes */}
        <div className="lg:col-span-2 space-y-4">

          {/* Order items */}
          <div className="bg-surface border border-border p-5">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">
              Produits ({order.items.length})
            </p>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-foreground text-sm">{item.productName}</p>
                    <p className="text-foreground/30 text-xs font-mono mt-0.5">
                      {item.productSku}
                      {item.packaging === "coffret" && " · Coffret cadeau"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-foreground/70 text-sm">×{item.quantity}</p>
                    <p className="text-gold text-sm font-medium">{formatPrice(item.total)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-border">
              <span className="text-foreground/50 text-xs uppercase tracking-wider">Total</span>
              <span className="text-gold font-semibold text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Notes from client */}
          {order.notes && (
            <div className="bg-surface border border-border p-5">
              <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3">Note du client</p>
              <p className="text-foreground/60 text-sm leading-relaxed">{order.notes}</p>
            </div>
          )}

          {/* Admin notes */}
          <OrderDetailClient
            orderId={order.id}
            currentStatus={order.status}
            currentNotes={order.notes ?? ""}
            phone={shipping.phone}
            orderNumber={order.orderNumber}
            locale={params.locale}
            notesOnly
          />
        </div>
      </div>
    </div>
  );
}
