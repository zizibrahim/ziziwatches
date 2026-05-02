"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Archive } from "lucide-react";

export default function ProductActions({
  productId,
  currentStatus,
  featured,
}: {
  productId: string;
  currentStatus: string;
  featured: boolean;
}) {
  const [isFeatured, setIsFeatured] = useState(featured);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const patch = async (data: Record<string, unknown>) => {
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.refresh();
  };

  const toggleFeatured = async () => {
    const next = !isFeatured;
    setIsFeatured(next);
    await patch({ featured: next });
  };

  const archive = async () => {
    if (!confirm("Archiver ce produit ?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 shrink-0">

      {/* Featured toggle button */}
      <button
        onClick={toggleFeatured}
        disabled={loading}
        title={isFeatured ? "Retirer de la vitrine" : "Afficher dans Pièces d'Exception"}
        className={`flex items-center gap-1 text-[10px] sm:text-[11px] tracking-wide px-2 sm:px-3 py-1.5 border transition-all duration-200 shrink-0 ${
          isFeatured
            ? "border-gold bg-gold/10 text-gold"
            : "border-border text-foreground/40 hover:border-gold/50 hover:text-gold"
        }`}
      >
        <Star size={10} fill={isFeatured ? "currentColor" : "none"} />
        <span className="hidden sm:inline">{isFeatured ? "En vedette" : "Mettre en avant"}</span>
        <span className="sm:hidden">{isFeatured ? "Vedette" : "Avant"}</span>
      </button>

      <select
        defaultValue={currentStatus}
        disabled={loading}
        onChange={(e) => patch({ status: e.target.value })}
        className="bg-background border border-border text-foreground/70 text-[10px] sm:text-xs px-1.5 sm:px-2 py-1.5 focus:outline-none focus:border-gold transition-colors"
      >
        <option value="ACTIVE">Actif</option>
        <option value="DRAFT">Brouillon</option>
      </select>

      <button
        onClick={archive}
        disabled={loading}
        title="Archiver"
        className="p-2 text-foreground/30 hover:text-red-400 transition-colors"
      >
        <Archive size={14} />
      </button>
    </div>
  );
}
