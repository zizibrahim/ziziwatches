import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock size={16} />,
  CONFIRMED: <CheckCircle size={16} />,
  PROCESSING: <Package size={16} />,
  SHIPPED: <Truck size={16} />,
  DELIVERED: <CheckCircle size={16} />,
  CANCELLED: <XCircle size={16} />,
};

export default async function OrderTrackingPage({
  params,
}: {
  params: { orderNumber: string; locale: string };
}) {
  const t = await getTranslations({ locale: params.locale, namespace: "order" });

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      items: true,
    },
  });

  if (!order) notFound();

  const shipping = JSON.parse(order.shippingAddress) as {
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    wilaya: string;
  };

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 section-padding pb-20">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gold" size={20} />
            </div>
            <h1 className="luxury-heading text-3xl font-light text-foreground mb-2">
              {t("confirmed")}
            </h1>
            <p className="text-foreground/40 text-sm">{t("confirmedDesc")}</p>
            <p className="text-gold text-xs tracking-widest uppercase mt-3 font-mono">
              {t("orderNumber")} : {order.orderNumber}
            </p>
          </div>

          {/* Progress tracker */}
          {!isCancelled && (
            <div className="bg-surface border border-border p-6 mb-6">
              <h2 className="text-foreground/60 text-xs tracking-widest uppercase mb-6">
                Suivi de commande
              </h2>
              <div className="relative">
                {/* Line */}
                <div className="absolute top-4 left-4 right-4 h-px bg-border" />
                <div
                  className="absolute top-4 left-4 h-px bg-gold transition-all duration-700"
                  style={{
                    width: currentStep <= 0 ? "0%" : `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors ${
                            done
                              ? "bg-gold border-gold text-obsidian"
                              : "bg-background border-border text-foreground/30"
                          } ${active ? "ring-2 ring-gold/30" : ""}`}
                        >
                          {STATUS_ICONS[step]}
                        </div>
                        <span
                          className={`text-[10px] tracking-wider uppercase text-center ${
                            done ? "text-gold" : "text-foreground/30"
                          }`}
                        >
                          {t(`status.${step}`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 mb-6 flex items-center gap-3">
              <XCircle className="text-red-400 shrink-0" size={18} />
              <p className="text-red-400 text-sm">{t(`status.CANCELLED`)}</p>
            </div>
          )}

          {/* Order items */}
          <div className="bg-surface border border-border p-6 mb-6">
            <h2 className="text-foreground/60 text-xs tracking-widest uppercase mb-4">
              Articles commandés
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-foreground font-medium">{item.productName}</p>
                    <p className="text-foreground/40 text-xs font-mono">{item.productSku} × {item.quantity}</p>
                  </div>
                  <span className="text-gold font-medium">{formatPrice(item.total)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-medium">
                <span className="text-foreground/70 text-sm">Total</span>
                <span className="text-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-surface border border-border p-6 mb-8">
            <h2 className="text-foreground/60 text-xs tracking-widest uppercase mb-4">
              Adresse de livraison
            </h2>
            <div className="text-sm text-foreground/70 space-y-1">
              <p className="text-foreground font-medium">{shipping.firstName} {shipping.lastName}</p>
              <p>{shipping.street}</p>
              <p>{shipping.city}, {shipping.wilaya}</p>
              <p className="font-mono">{shipping.phone}</p>
            </div>
            <p className="text-foreground/30 text-xs mt-3">
              Commandé le {format(new Date(order.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
            </p>
          </div>

          <div className="flex gap-4">
            <Link href={`/${params.locale}/shop`} className="btn-outline flex-1 text-center">
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
