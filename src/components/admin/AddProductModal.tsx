"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

interface Category {
  id: string;
  nameFr: string;
}

export default function AddProductModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    nameFr: "", nameEn: "", nameAr: "",
    descriptionFr: "", descriptionEn: "", descriptionAr: "",
    price: "", compareAtPrice: "", stock: "0",
    categoryId: categories[0]?.id ?? "",
    imageUrl: "", featured: false, isNew: false,
    status: "ACTIVE",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        stock: parseInt(form.stock),
        imageUrl: form.imageUrl || null,
      }),
    });
    setLoading(false);
    if (!res.ok) { setError("Erreur lors de la création."); return; }
    setOpen(false);
    router.refresh();
  };

  const inputClass = "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-foreground/50 text-xs tracking-wider uppercase mb-1";

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-gold text-sm px-4 py-2">
        + Ajouter un produit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="luxury-heading text-xl font-light text-foreground">Nouveau produit</h2>
              <button onClick={() => setOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[["nameFr", "Nom (FR)"], ["nameEn", "Nom (EN)"], ["nameAr", "Nom (AR)"]].map(([k, l]) => (
                  <div key={k}>
                    <label className={labelClass}>{l}</label>
                    <input required value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[["descriptionFr", "Description (FR)"], ["descriptionEn", "Description (EN)"], ["descriptionAr", "Description (AR)"]].map(([k, l]) => (
                  <div key={k}>
                    <label className={labelClass}>{l}</label>
                    <textarea required rows={2} value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={inputClass + " resize-none"} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Prix (DZD)</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prix barré</label>
                  <input type="number" min="0" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock</label>
                  <input required type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Catégorie</label>
                  <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Statut</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                    <option value="ACTIVE">Actif</option>
                    <option value="DRAFT">Brouillon</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>URL image</label>
                <input type="url" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className={inputClass} placeholder="https://..." />
              </div>

              <div className="flex gap-6">
                {[["featured", "Mis en avant"], ["isNew", "Nouveau"]].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={(e) => set(k, e.target.checked)}
                      className="w-4 h-4 accent-gold" />
                    <span className="text-foreground/70 text-sm">{l}</span>
                  </label>
                ))}
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1">Annuler</button>
                <button type="submit" disabled={loading} className="btn-gold flex-1 disabled:opacity-60">
                  {loading ? "Création..." : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
