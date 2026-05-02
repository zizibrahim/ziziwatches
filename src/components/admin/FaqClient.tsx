"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2, Pencil, Eye, EyeOff } from "lucide-react";

const CATEGORIES = [
  { value: "general",   label: "General" },
  { value: "watches",   label: "Watches" },
  { value: "jewellery", label: "Jewellery" },
  { value: "shipping",  label: "Shipping" },
  { value: "orders",    label: "My Order" },
  { value: "payment",   label: "Payment" },
  { value: "account",   label: "Customer Account" },
];

interface Faq {
  id: string;
  questionFr: string;
  questionEn: string;
  questionAr: string;
  answerFr: string;
  answerEn: string;
  answerAr: string;
  category: string;
  popular: boolean;
  order: number;
  published: boolean;
}

const inputClass =
  "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
const labelClass =
  "block text-foreground/50 text-xs tracking-wider uppercase mb-1";

function FaqModal({
  faq,
  onClose,
}: {
  faq?: Faq;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    questionFr: faq?.questionFr ?? "",
    questionEn: faq?.questionEn ?? "",
    questionAr: faq?.questionAr ?? "",
    answerFr: faq?.answerFr ?? "",
    answerEn: faq?.answerEn ?? "",
    answerAr: faq?.answerAr ?? "",
    category: faq?.category ?? "general",
    popular: faq?.popular ?? false,
    order: faq?.order ?? 0,
    published: faq?.published ?? true,
  });

  const set = (k: string, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (faq) {
      await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setLoading(false);
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="luxury-heading text-xl font-light text-foreground">
            {faq ? "Modifier la FAQ" : "Nouvelle FAQ"}
          </h2>
          <button
            onClick={onClose}
            className="text-foreground/40 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-gold text-xs tracking-[0.2em] uppercase">
            Français
          </p>
          <div>
            <label className={labelClass}>Question (FR) *</label>
            <input
              required
              value={form.questionFr}
              onChange={(e) => set("questionFr", e.target.value)}
              className={inputClass}
              placeholder="Ex: Quel est le délai de livraison ?"
            />
          </div>
          <div>
            <label className={labelClass}>Réponse (FR) *</label>
            <textarea
              required
              rows={3}
              value={form.answerFr}
              onChange={(e) => set("answerFr", e.target.value)}
              className={inputClass + " resize-none"}
            />
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">
              English
            </p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Question (EN) *</label>
                <input
                  required
                  value={form.questionEn}
                  onChange={(e) => set("questionEn", e.target.value)}
                  className={inputClass}
                  placeholder="Ex: What is the delivery time?"
                />
              </div>
              <div>
                <label className={labelClass}>Answer (EN) *</label>
                <textarea
                  required
                  rows={3}
                  value={form.answerEn}
                  onChange={(e) => set("answerEn", e.target.value)}
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-gold text-xs tracking-[0.2em] uppercase mb-4">
              العربية
            </p>
            <div className="space-y-4" dir="rtl">
              <div>
                <label className={labelClass}>السؤال (AR) *</label>
                <input
                  required
                  value={form.questionAr}
                  onChange={(e) => set("questionAr", e.target.value)}
                  className={inputClass}
                  placeholder="مثال: ما هو وقت التوصيل؟"
                />
              </div>
              <div>
                <label className={labelClass}>الجواب (AR) *</label>
                <textarea
                  required
                  rows={3}
                  value={form.answerAr}
                  onChange={(e) => set("answerAr", e.target.value)}
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <div>
              <label className={labelClass}>Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ordre d'affichage</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) => set("order", parseInt(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("published", !form.published)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      form.published ? "bg-gold" : "bg-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.published ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-foreground/50 tracking-wider uppercase">
                    {form.published ? "Publié" : "Masqué"}
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set("popular", !form.popular)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${
                      form.popular ? "bg-gold" : "bg-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        form.popular ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-xs text-foreground/50 tracking-wider uppercase">
                    {form.popular ? "Populaire" : "Normal"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 text-sm py-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold flex-1 text-sm py-2 disabled:opacity-60"
            >
              {loading ? "Enregistrement..." : faq ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FaqClient({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const togglePublish = async (faq: Faq) => {
    await fetch(`/api/admin/faqs/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !faq.published }),
    });
    router.refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette FAQ ?")) return;
    setDeleting(id);
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">
            Administration
          </p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">
            FAQ
          </h1>
          <p className="text-foreground/40 text-sm mt-1">
            Questions fréquentes affichées sur la page Contact
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-gold flex items-center gap-2 text-sm px-4 py-2"
        >
          <Plus size={14} /> Nouvelle question
        </button>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border">
          <p className="text-foreground/30 text-sm mb-4">Aucune FAQ pour l'instant</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-gold text-xs tracking-wider uppercase hover:underline"
          >
            Ajouter une première question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-surface border border-border p-5 flex items-start justify-between gap-4 group hover:border-gold/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-foreground/20 text-[10px] font-mono">
                    #{faq.order}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                      faq.published
                        ? "text-green-400 bg-green-400/10"
                        : "text-foreground/30 bg-foreground/5"
                    }`}
                  >
                    {faq.published ? "Publié" : "Masqué"}
                  </span>
                  {faq.category && faq.category !== "general" && (
                    <span className="text-[10px] px-2 py-0.5 uppercase tracking-wider text-gold bg-gold/10">
                      {faq.category}
                    </span>
                  )}
                  {faq.popular && (
                    <span className="text-[10px] px-2 py-0.5 uppercase tracking-wider text-blue-400 bg-blue-400/10">
                      Populaire
                    </span>
                  )}
                </div>
                <p className="text-foreground/90 text-sm font-medium truncate">
                  {faq.questionFr}
                </p>
                <p className="text-foreground/40 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {faq.answerFr}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => togglePublish(faq)}
                  title={faq.published ? "Masquer" : "Publier"}
                  className="p-1.5 text-foreground/30 hover:text-gold transition-colors"
                >
                  {faq.published ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button
                  onClick={() => setEditing(faq)}
                  title="Modifier"
                  className="p-1.5 text-foreground/30 hover:text-gold transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => remove(faq.id)}
                  disabled={deleting === faq.id}
                  title="Supprimer"
                  className="p-1.5 text-foreground/30 hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <FaqModal onClose={() => setShowAdd(false)} />}
      {editing && (
        <FaqModal faq={editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
