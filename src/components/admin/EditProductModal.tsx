"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Pencil, Sparkles, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface Category {
  id: string;
  nameFr: string;
}

interface Product {
  id: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAtPrice: number | null;
  coffretPrice: number | null;
  stock: number;
  categoryId: string;
  status: string;
  featured: boolean;
  isNew: boolean;
  imageUrl?: string | null;
}

export default function EditProductModal({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({
    nameFr: product.nameFr,
    nameEn: product.nameEn,
    nameAr: product.nameAr,
    descriptionFr: product.descriptionFr,
    descriptionEn: product.descriptionEn,
    descriptionAr: product.descriptionAr,
    price: String(product.price),
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    coffretPrice: product.coffretPrice ? String(product.coffretPrice) : "",
    stock: String(product.stock),
    categoryId: product.categoryId,
    status: product.status,
    featured: product.featured,
    isNew: product.isNew,
    imageUrl: product.imageUrl ?? "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const canGenerate = form.nameFr.trim() && form.nameEn.trim() && form.categoryId;

  const handleGenerate = async () => {
    if (!canGenerate || aiLoading) return;
    setAiLoading(true);
    try {
      const category = categories.find((c) => c.id === form.categoryId)?.nameFr ?? "";
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameFr: form.nameFr, nameEn: form.nameEn, category, specs: [] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((f) => ({
        ...f,
        descriptionFr: data.descriptionFr ?? f.descriptionFr,
        descriptionEn: data.descriptionEn ?? f.descriptionEn,
        descriptionAr: data.descriptionAr ?? f.descriptionAr,
      }));
    } catch {
      setError("Erreur IA. Vérifiez votre GEMINI_API_KEY.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameFr: form.nameFr,
        nameEn: form.nameEn,
        nameAr: form.nameAr,
        descriptionFr: form.descriptionFr,
        descriptionEn: form.descriptionEn,
        descriptionAr: form.descriptionAr,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        coffretPrice: form.coffretPrice ? parseFloat(form.coffretPrice) : null,
        stock: parseInt(form.stock),
        categoryId: form.categoryId,
        status: form.status,
        featured: form.featured,
        isNew: form.isNew,
        imageUrl: form.imageUrl || null,
      }),
    });
    setLoading(false);
    if (!res.ok) { setError("Erreur lors de la modification."); return; }
    setOpen(false);
    router.refresh();
  };

  const inputClass = "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-foreground/50 text-xs tracking-wider uppercase mb-1";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Modifier"
        className="p-1.5 text-foreground/30 hover:text-gold transition-colors"
      >
        <Pencil size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="luxury-heading text-xl font-light text-foreground">Modifier le produit</h2>
              <button onClick={() => setOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[["nameFr", "Nom (FR)"], ["nameEn", "Nom (EN)"], ["nameAr", "Nom (AR)"]] .map(([k, l]) => (
                  <div key={k}>
                    <label className={labelClass}>{l}</label>
                    <input required value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>

              {/* AI Generate button */}
              <div className="flex items-center justify-between py-1">
                <p className="text-foreground/30 text-xs">Descriptions · FR / EN / AR</p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate || aiLoading}
                  className="flex items-center gap-1.5 text-xs text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {aiLoading ? "Génération..." : "Regénérer avec l'IA"}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {[["descriptionFr", "Description (FR)"], ["descriptionEn", "Description (EN)"], ["descriptionAr", "Description (AR)"]].map(([k, l]) => (
                  <div key={k}>
                    <label className={labelClass}>{l}</label>
                    <textarea required rows={2} value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={inputClass + " resize-none"} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className={labelClass}>Prix coffret (+DZD)</label>
                  <input type="number" min="0" value={form.coffretPrice} onChange={(e) => set("coffretPrice", e.target.value)} className={inputClass} placeholder="Laisser vide si non" />
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
                <label className={labelClass}>Image du produit</label>
                <ImageUpload value={form.imageUrl} onChange={(url) => set("imageUrl", url)} />
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
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
