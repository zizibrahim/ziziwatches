"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Package, CheckCircle, Truck, Clock, XCircle, Loader2, MapPin, Gift } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const OLIVE = "#3d4535";
const GOLD  = "#c9b97a";

const STEPS = [
  { key: "PENDING",    label: "Reçue",        icon: Clock },
  { key: "CONFIRMED",  label: "Confirmée",    icon: CheckCircle },
  { key: "PROCESSING", label: "Préparation",  icon: Package },
  { key: "SHIPPED",    label: "En livraison", icon: Truck },
  { key: "DELIVERED",  label: "Livrée",       icon: CheckCircle },
] as const;

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_MESSAGES: Record<string, { title: string; desc: string }> = {
  PENDING:    { title: "Commande reçue",        desc: "Nous avons bien reçu votre commande et elle est en cours de traitement." },
  CONFIRMED:  { title: "Commande confirmée",    desc: "Votre commande a été confirmée. Nous préparons votre colis." },
  PROCESSING: { title: "En cours de préparation", desc: "Votre colis est en cours de préparation avec soin." },
  SHIPPED:    { title: "En route vers vous",    desc: "Votre colis est parti ! Le livreur est en chemin." },
  DELIVERED:  { title: "Livrée avec succès",    desc: "Votre commande a été livrée. Profitez-en !" },
  CANCELLED:  { title: "Commande annulée",      desc: "Cette commande a été annulée." },
};

type OrderData = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  city: string | null;
  firstName: string | null;
  items: { name: string; quantity: number; unitPrice: number; packaging: string; image: string | null }[];
};

function StatusTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  const progressPct = currentIdx < 0 ? 0 : (currentIdx / (STEPS.length - 1)) * 100;

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-4 p-5 border" style={{ borderColor: "#fca5a5", background: "#fff1f2" }}>
        <XCircle size={22} className="text-red-400 shrink-0" />
        <div>
          <p className="text-red-600 font-semibold text-sm">Commande annulée</p>
          <p className="text-red-400 text-xs mt-0.5">Pour toute question, contactez notre équipe.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Status message */}
      <div className="mb-8 p-5 border-l-2" style={{ borderColor: OLIVE, background: "#f5f0e8" }}>
        <p className="font-semibold text-sm mb-1" style={{ color: OLIVE }}>
          {STATUS_MESSAGES[status]?.title ?? status}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#6b7a57" }}>
          {STATUS_MESSAGES[status]?.desc}
        </p>
      </div>

      {/* Progress bar + steps */}
      <div className="relative">
        {/* Track */}
        <div className="absolute top-5 left-5 right-5 h-0.5 hidden sm:block" style={{ background: "#e2ddd6" }} />
        {/* Filled track */}
        <div
          className="absolute top-5 left-5 h-0.5 hidden sm:block transition-all duration-700"
          style={{ background: OLIVE, width: `calc(${progressPct}% - 10px)` }}
        />

        <div className="flex flex-col sm:flex-row justify-between gap-5 sm:gap-2 relative">
          {STEPS.map((step, i) => {
            const done    = i <= currentIdx;
            const current = i === currentIdx;
            const Icon    = step.icon;
            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1">
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                  style={{
                    background: current ? OLIVE : done ? "#e8f0e5" : "#f0ece6",
                    border: `2px solid ${current ? OLIVE : done ? OLIVE : "#d4cfc7"}`,
                    boxShadow: current ? `0 0 0 4px ${OLIVE}20` : "none",
                    transform: current ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <Icon
                    size={15}
                    strokeWidth={2}
                    color={current ? "#fff" : done ? OLIVE : "#b8b0a5"}
                  />
                </div>
                <p
                  className="text-[10px] tracking-[0.12em] uppercase font-medium text-center leading-tight"
                  style={{ color: current ? OLIVE : done ? "#6b7a57" : "#b8b0a5" }}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SuiviPage() {
  const [orderNum, setOrderNum] = useState("");
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState("");
  const [order, setOrder]      = useState<OrderData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?n=${encodeURIComponent(orderNum.trim())}`);
      if (res.status === 404) { setError("Aucune commande trouvée. Vérifiez votre numéro de commande."); return; }
      if (!res.ok) { setError("Une erreur est survenue. Réessayez."); return; }
      setOrder(await res.json());
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background pb-24">

        {/* Hero */}
        <div
          className="pt-32 pb-20 text-center relative overflow-hidden"
          style={{ background: `linear-gradient(160deg, #f5f0e8 0%, #eae4d8 100%)` }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: OLIVE }} />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10" style={{ background: GOLD }} />

          <div className="relative z-10 section-padding">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <p className="text-[10px] tracking-[0.5em] uppercase font-medium" style={{ color: OLIVE }}>Ziziwatches</p>
              <div className="h-px w-8" style={{ background: GOLD }} />
            </div>
            <h1 className="luxury-heading text-5xl md:text-6xl font-light mb-4" style={{ color: OLIVE }}>
              Suivi de commande
            </h1>
            <p className="text-sm tracking-wide max-w-xs mx-auto" style={{ color: "#7a8660" }}>
              Entrez votre numéro pour suivre votre colis en temps réel.
            </p>
          </div>
        </div>

        <div className="section-padding max-w-2xl mx-auto -mt-8 relative z-10">

          {/* Search card */}
          <div className="shadow-xl mb-10" style={{ background: "#fff" }}>
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${OLIVE}, #6b7a57, ${OLIVE})` }} />
            <form onSubmit={handleSubmit} className="p-8">
              <label className="block text-[10px] tracking-[0.35em] uppercase font-semibold mb-3" style={{ color: "#7a8660" }}>
                Numéro de commande
              </label>
              <div className="flex gap-3">
                <input
                  value={orderNum}
                  onChange={e => setOrderNum(e.target.value)}
                  placeholder="ZW-2026-XXXX"
                  required
                  className="flex-1 border-b-2 bg-transparent py-3 text-base placeholder:text-[#c0b9ae] focus:outline-none transition-colors duration-200"
                  style={{
                    borderColor: orderNum ? OLIVE : "#d4cfc7",
                    color: OLIVE,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 text-white text-xs tracking-[0.25em] uppercase font-bold transition-opacity hover:opacity-80 disabled:opacity-50 shrink-0"
                  style={{ background: OLIVE }}
                >
                  {loading
                    ? <Loader2 size={16} className="animate-spin" />
                    : <span>Suivre</span>
                  }
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 flex items-center gap-2 text-sm"
                    style={{ color: "#dc2626" }}
                  >
                    <XCircle size={15} className="shrink-0" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Result */}
          <AnimatePresence>
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Order identity bar */}
                <div
                  className="flex items-center justify-between gap-4 px-7 py-5 mb-1"
                  style={{ background: OLIVE }}
                >
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-0.5">Commande</p>
                    <p className="font-mono text-lg font-semibold text-white tracking-wider">{order.orderNumber}</p>
                    {order.firstName && (
                      <p className="text-white/60 text-xs mt-1 flex items-center gap-1.5">
                        {order.firstName}
                        {order.city && <><MapPin size={10} className="inline" /> {order.city}</>}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-0.5">Total</p>
                    <p className="text-2xl font-light" style={{ color: GOLD }}>{formatPrice(order.total)}</p>
                  </div>
                </div>

                {/* Timeline section */}
                <div className="bg-white p-7 mb-1">
                  <p className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-6" style={{ color: "#9a9080" }}>
                    Statut de la commande
                  </p>
                  <StatusTimeline status={order.status} />
                </div>

                {/* Items section */}
                <div className="bg-white p-7 mb-1">
                  <p className="text-[10px] tracking-[0.35em] uppercase font-semibold mb-5" style={{ color: "#9a9080" }}>
                    Articles commandés
                  </p>
                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 shrink-0 overflow-hidden"
                          style={{ background: "#f5f0e8" }}
                        >
                          {item.image
                            ? <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <Package size={20} style={{ color: "#c8c0b0" }} />
                              </div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: OLIVE }}>{item.name}</p>
                          <p className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "#a09880" }}>
                            Qté : {item.quantity}
                            {item.packaging === "coffret" && (
                              <span className="flex items-center gap-1" style={{ color: GOLD }}>
                                <Gift size={10} /> Coffret cadeau
                              </span>
                            )}
                          </p>
                        </div>
                        <p className="text-sm font-medium shrink-0" style={{ color: OLIVE }}>
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total row */}
                  <div
                    className="flex items-center justify-between mt-5 pt-5 border-t"
                    style={{ borderColor: "#e8e2d8" }}
                  >
                    <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "#9a9080" }}>Total</p>
                    <p className="text-lg font-semibold" style={{ color: OLIVE }}>{formatPrice(order.total)}</p>
                  </div>
                </div>

                {/* Help section */}
                <div
                  className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                  style={{ background: "#f5f0e8" }}
                >
                  <p className="text-xs" style={{ color: "#8a9070" }}>
                    Un problème avec votre commande ?
                  </p>
                  <a
                    href={`https://wa.me/212717728154?text=${encodeURIComponent(`Bonjour, j'ai une question sur ma commande ${order.orderNumber}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs px-5 py-2.5 font-medium border transition-all hover:border-[#25D366] hover:text-[#25D366]"
                    style={{ borderColor: "#c8c0b0", color: "#6b7a57" }}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.514 5.83L0 24l6.335-1.493A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 01-5.031-1.388l-.36-.214-3.732.879.916-3.63-.235-.374A9.786 9.786 0 012.182 12c0-5.418 4.4-9.818 9.818-9.818 5.418 0 9.818 4.4 9.818 9.818 0 5.418-4.4 9.818-9.818 9.818z"/></svg>
                    Contacter via WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <Footer />
    </>
  );
}
