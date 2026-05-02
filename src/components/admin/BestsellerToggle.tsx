"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

export default function BestsellerToggle({
  productId,
  isBestseller,
}: {
  productId: string;
  isBestseller: boolean;
}) {
  const [active, setActive] = useState(isBestseller);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    const next = !active;
    setActive(next);
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBestseller: next }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? "Retirer des bestsellers" : "Ajouter aux bestsellers"}
      className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] tracking-wide transition-all duration-200 disabled:opacity-50 ${
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-500"
          : "border-border text-foreground/40 hover:border-amber-500/50 hover:text-amber-500"
      }`}
    >
      <Trophy size={11} fill={active ? "currentColor" : "none"} />
      {active ? "Bestseller" : "Ajouter"}
    </button>
  );
}
