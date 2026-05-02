"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function NewArrivalToggle({
  productId,
  isNew,
}: {
  productId: string;
  isNew: boolean;
}) {
  const [active, setActive] = useState(isNew);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    const next = !active;
    setActive(next);
    setLoading(true);
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isNew: next }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={active ? "Retirer des nouveautés" : "Ajouter aux nouveautés"}
      className={`flex items-center gap-1.5 px-3 py-1.5 border text-[11px] tracking-wide transition-all duration-200 disabled:opacity-50 ${
        active
          ? "border-olive bg-olive/10 text-olive"
          : "border-border text-foreground/40 hover:border-olive/50 hover:text-olive"
      }`}
    >
      <Sparkles size={11} fill={active ? "currentColor" : "none"} />
      {active ? "Nouveauté" : "Ajouter"}
    </button>
  );
}
