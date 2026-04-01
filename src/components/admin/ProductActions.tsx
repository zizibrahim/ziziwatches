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

  const archive = async () => {
    if (!confirm("Archiver ce produit ?")) return;
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => patch({ featured: !featured })}
        disabled={loading}
        title={featured ? "Retirer des favoris" : "Mettre en avant"}
        className={`p-2 transition-colors ${featured ? "text-gold" : "text-foreground/30 hover:text-gold"}`}
      >
        <Star size={14} fill={featured ? "currentColor" : "none"} />
      </button>

      <select
        defaultValue={currentStatus}
        disabled={loading}
        onChange={(e) => patch({ status: e.target.value })}
        className="bg-background border border-border text-foreground/70 text-xs px-2 py-1.5 focus:outline-none focus:border-gold transition-colors"
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
