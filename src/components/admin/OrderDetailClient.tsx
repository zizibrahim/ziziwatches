"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Truck, Package, RotateCcw, MessageCircle, Loader2 } from "lucide-react";

const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "En attente",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  CONFIRMED:  { label: "Confirmée",    color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  PROCESSING: { label: "En préparation", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  SHIPPED:    { label: "Expédiée",     color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  DELIVERED:  { label: "Livrée",       color: "text-green-400 bg-green-400/10 border-green-400/20" },
  CANCELLED:  { label: "Annulée",      color: "text-red-400 bg-red-400/10 border-red-400/20" },
  RETURNED:   { label: "Retournée",    color: "text-foreground/50 bg-foreground/5 border-border" },
};

interface Props {
  orderId: string;
  currentStatus: string;
  currentNotes: string;
  phone: string;
  orderNumber: string;
  locale: string;
  notesOnly?: boolean;
}

export default function OrderDetailClient({
  orderId, currentStatus, currentNotes, phone, orderNumber, notesOnly = false,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setSavingStatus(true);
    setStatus(newStatus);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSavingStatus(false);
    router.refresh();
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const waMessage = encodeURIComponent(
    `Bonjour ! Concernant votre commande ${orderNumber}, `
  );
  const waLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${waMessage}`;

  if (notesOnly) {
    return (
      <div className="bg-surface border border-border p-5">
        <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-3">Notes admin</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Ex: Le client veut la couleur noire · Client ne répond pas..."
          className="w-full bg-background border border-border text-foreground text-sm px-3 py-2.5 focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-foreground/20"
        />
        <button
          onClick={saveNotes}
          disabled={savingNotes}
          className="mt-2 flex items-center gap-2 text-xs tracking-wider uppercase px-4 py-2 border border-gold/40 text-gold hover:bg-gold/5 transition-colors disabled:opacity-50"
        >
          {savingNotes ? <Loader2 size={11} className="animate-spin" /> : null}
          {notesSaved ? "✓ Enregistré" : "Enregistrer la note"}
        </button>
      </div>
    );
  }

  const meta = STATUS_META[status] ?? STATUS_META.PENDING;

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      {/* Current status badge */}
      <span className={`text-xs px-3 py-1.5 border rounded-full font-medium ${meta.color}`}>
        {meta.label}
      </span>

      {/* WhatsApp button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
      >
        <MessageCircle size={13} />
        WhatsApp client
      </a>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2 justify-end">
        {status === "PENDING" && (
          <button
            onClick={() => updateStatus("CONFIRMED")}
            disabled={savingStatus}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-blue-400/10 border border-blue-400/30 text-blue-400 hover:bg-blue-400/20 transition-colors disabled:opacity-50"
          >
            <CheckCircle size={12} /> Confirmer
          </button>
        )}
        {(status === "CONFIRMED" || status === "PENDING") && (
          <button
            onClick={() => updateStatus("PROCESSING")}
            disabled={savingStatus}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-purple-400/10 border border-purple-400/30 text-purple-400 hover:bg-purple-400/20 transition-colors disabled:opacity-50"
          >
            <Package size={12} /> En préparation
          </button>
        )}
        {status === "PROCESSING" && (
          <button
            onClick={() => updateStatus("SHIPPED")}
            disabled={savingStatus}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-orange-400/10 border border-orange-400/30 text-orange-400 hover:bg-orange-400/20 transition-colors disabled:opacity-50"
          >
            <Truck size={12} /> Expédier
          </button>
        )}
        {status === "SHIPPED" && (
          <>
            <button
              onClick={() => updateStatus("DELIVERED")}
              disabled={savingStatus}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-green-400/10 border border-green-400/30 text-green-400 hover:bg-green-400/20 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={12} /> Livrée
            </button>
            <button
              onClick={() => updateStatus("RETURNED")}
              disabled={savingStatus}
              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-foreground/5 border border-border text-foreground/50 hover:text-foreground/80 transition-colors disabled:opacity-50"
            >
              <RotateCcw size={12} /> Retournée
            </button>
          </>
        )}
        {!["CANCELLED", "DELIVERED", "RETURNED"].includes(status) && (
          <button
            onClick={() => updateStatus("CANCELLED")}
            disabled={savingStatus}
            className="flex items-center gap-1.5 text-xs px-3 py-2 bg-red-400/10 border border-red-400/30 text-red-400 hover:bg-red-400/20 transition-colors disabled:opacity-50"
          >
            <XCircle size={12} /> Annuler
          </button>
        )}
      </div>
    </div>
  );
}
