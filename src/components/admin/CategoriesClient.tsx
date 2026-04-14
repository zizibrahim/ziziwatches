"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
}

const inputClass =
  "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
const labelClass =
  "block text-foreground/50 text-xs tracking-wider uppercase mb-1";

function CategoryModal({ category, onClose }: { category?: Category; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nameFr: category?.nameFr ?? "",
    nameEn: category?.nameEn ?? "",
    nameAr: category?.nameAr ?? "",
    slug: category?.slug ?? "",
  });

  const set = (k: string, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      // Auto-generate slug from French name if creating new
      if (k === "nameFr" && !category) {
        next.slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const url = category ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
    const method = category ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Erreur lors de l'enregistrement.");
      return;
    }
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-background border border-border w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="luxury-heading text-xl font-light text-foreground">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>Nom (FR) *</label>
            <input required value={form.nameFr} onChange={(e) => set("nameFr", e.target.value)} className={inputClass} placeholder="Montres Femme" />
          </div>
          <div>
            <label className={labelClass}>Nom (EN) *</label>
            <input required value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className={inputClass} placeholder="Women's Watches" />
          </div>
          <div>
            <label className={labelClass}>Nom (AR) *</label>
            <input required value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className={inputClass} placeholder="ساعات نسائية" dir="rtl" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL) *</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} placeholder="montres-femme" />
            <p className="text-foreground/30 text-[11px] mt-1">Généré automatiquement · ex: montres-femme</p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1 text-sm py-2">Annuler</button>
            <button type="submit" disabled={loading} className="btn-gold flex-1 text-sm py-2 disabled:opacity-60">
              {loading ? "Enregistrement..." : category ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [seeding, setSeeding] = useState(false);

  const seedDefaults = async () => {
    setSeeding(true);
    await fetch("/api/admin/categories/seed", { method: "POST" });
    setSeeding(false);
    router.refresh();
  };

  const remove = async (cat: Category) => {
    if (!confirm(`Supprimer "${cat.nameFr}" ? Les produits liés perdront leur catégorie.`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    if (!res.ok) { alert("Impossible de supprimer — des produits utilisent cette catégorie."); return; }
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Catégories</h1>
          <p className="text-foreground/40 text-sm mt-1">Gérez les sections de votre boutique</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={14} /> Nouvelle catégorie
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border">
          <p className="text-foreground/30 text-sm mb-2">Aucune catégorie pour l'instant</p>
          <p className="text-foreground/20 text-xs mb-8">Organisez vos produits par section</p>
          <button
            onClick={seedDefaults}
            disabled={seeding}
            className="btn-gold text-sm px-6 py-2.5 mb-4 disabled:opacity-60"
          >
            {seeding ? "Création..." : "Créer les 5 catégories par défaut"}
          </button>
          <p className="text-foreground/20 text-[11px] mb-1">Montres Homme · Montres Femme · Accessoires · Packs · Cadeaux</p>
          <p className="text-foreground/15 text-[11px] mt-4">
            ou{" "}
            <button onClick={() => setShowAdd(true)} className="text-gold/60 hover:text-gold transition-colors underline">
              ajouter manuellement
            </button>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-surface border border-border px-5 py-4 flex items-center justify-between gap-4 hover:border-gold/20 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium">{cat.nameFr}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-foreground/30 text-xs font-mono">/{cat.slug}</span>
                  <span className="text-foreground/30 text-xs">· {cat.nameEn}</span>
                  <span className="text-foreground/30 text-xs" dir="rtl">· {cat.nameAr}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditing(cat)}
                  className="p-1.5 text-foreground/30 hover:text-gold transition-colors"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(cat)}
                  className="p-1.5 text-foreground/30 hover:text-red-400 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <CategoryModal onClose={() => setShowAdd(false)} />}
      {editing && <CategoryModal category={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
