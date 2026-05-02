"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, Loader2 } from "lucide-react";
import MediaGalleryUpload, { type MediaItem } from "./MediaGalleryUpload";
import VariantEditor, { type VariantData } from "./VariantEditor";
import AttributeEditor, { type AttributeData } from "./AttributeEditor";

const PAGE_TYPES = [
  { value: "montres",  label: "Montres",  icon: "⌚" },
  { value: "bijoux",   label: "Bijoux",   icon: "💍" },
  { value: "packs",    label: "Packs",    icon: "📦" },
  { value: "cadeaux",  label: "Cadeaux",  icon: "🎁" },
];

export default function AddProductModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [images, setImages] = useState<MediaItem[]>([]);
  const [variants, setVariants] = useState<VariantData[]>([]);
  const [attributes, setAttributes] = useState<AttributeData[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [pageType, setPageType] = useState("montres");

  const toggleTag = (tag: string) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const [form, setForm] = useState({
    nameFr: "", nameEn: "", nameAr: "",
    descriptionFr: "", descriptionEn: "", descriptionAr: "",
    price: "", compareAtPrice: "", stock: "0",
    featured: false, isNew: false,
    status: "ACTIVE", coffretPrice: "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const canGenerate = form.nameFr.trim() && form.nameEn.trim();

  const handleGenerate = async () => {
    if (!canGenerate || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameFr: form.nameFr, nameEn: form.nameEn, category: pageType, specs: [] }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((f) => ({
        ...f,
        descriptionFr: data.descriptionFr ?? f.descriptionFr,
        descriptionEn: data.descriptionEn ?? f.descriptionEn,
        descriptionAr: data.descriptionAr ?? f.descriptionAr,
        nameAr: f.nameAr || (data.nameAr ?? f.nameAr),
      }));
    } catch {
      setError("Erreur IA. Vérifiez votre GEMINI_API_KEY.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageType) { setError("Choisissez une page."); return; }
    setError(""); setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        pageType,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : null,
        coffretPrice: form.coffretPrice ? parseFloat(form.coffretPrice) : null,
        stock: parseInt(form.stock),
        tags,
        images,
        variants: variants.filter(v => v.colorName.trim()).map((v) => ({
          colorName: v.colorName,
          colorHex: v.colorHex,
          stock: v.stock,
          images: v.images,
        })),
        attributes: attributes.filter(a => a.keyFr.trim() && a.valueFr.trim()),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.error || "Erreur lors de la création.");
      return;
    }
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* ── Page selector ── */}
              <div>
                <label className={labelClass}>Page *</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {PAGE_TYPES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPageType(p.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 border text-xs transition-all ${
                        pageType === p.value
                          ? "border-olive bg-olive/5 text-olive"
                          : "border-border text-foreground/40 hover:border-foreground/30 hover:text-foreground/60"
                      }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="tracking-wide uppercase">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Gender tags ── */}
              <div>
                <label className={labelClass}>Genre</label>
                <div className="flex gap-4 mt-1">
                  {[
                    { tag: "homme", label: "Homme" },
                    { tag: "femme", label: "Femme" },
                    { tag: "couple", label: "Couple" },
                  ].map(({ tag, label }) => (
                    <label key={tag} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} className="w-4 h-4 accent-gold" />
                      <span className="text-foreground/70 text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-border/50" />

              {/* ── Names ── */}
              <div className="grid grid-cols-3 gap-3">
                {[["nameFr", "Nom (FR)"], ["nameEn", "Nom (EN)"], ["nameAr", "Nom (AR)"]].map(([k, l]) => (
                  <div key={k}>
                    <label className={labelClass}>{l}</label>
                    <input required={k !== "nameAr"} value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className={inputClass} />
                  </div>
                ))}
              </div>

              {/* ── AI descriptions ── */}
              <div className="flex items-center justify-between">
                <p className="text-foreground/30 text-xs">Descriptions · FR / EN / AR</p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate || aiLoading}
                  className="flex items-center gap-1.5 text-xs text-gold border border-gold/30 px-3 py-1.5 hover:bg-gold/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {aiLoading ? "Génération..." : "Générer avec l'IA"}
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

              {/* ── Pricing & stock ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Prix (MAD) *</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prix barré</label>
                  <input type="number" min="0" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Prix coffret (+MAD)</label>
                  <input type="number" min="0" value={form.coffretPrice} onChange={(e) => set("coffretPrice", e.target.value)} className={inputClass} placeholder="Laisser vide si non" />
                </div>
              </div>

              {/* ── Status ── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Statut</label>
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass}>
                    <option value="ACTIVE">Actif</option>
                    <option value="DRAFT">Brouillon</option>
                    <option value="ARCHIVED">Archivé</option>
                  </select>
                </div>
                <div className="flex items-end gap-4 pb-0.5">
                  {[["featured", "Mis en avant"], ["isNew", "Nouveau"]].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[k as keyof typeof form] as boolean} onChange={(e) => set(k, e.target.checked)} className="w-4 h-4 accent-gold" />
                      <span className="text-foreground/70 text-sm">{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Media ── */}
              <div>
                <label className={labelClass}>Photos & vidéos</label>
                <MediaGalleryUpload value={images} onChange={setImages} />
              </div>

              {/* ── Variants ── */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <label className={labelClass + " mb-0"}>Variantes de couleur</label>
                  <span className="text-foreground/25 text-[10px]">optionnel</span>
                </div>
                <VariantEditor value={variants} onChange={setVariants} />
              </div>

              {/* ── Attributes ── */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <label className={labelClass + " mb-0"}>Caractéristiques techniques</label>
                  <span className="text-foreground/25 text-[10px]">optionnel</span>
                </div>
                <AttributeEditor value={attributes} onChange={setAttributes} />
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
