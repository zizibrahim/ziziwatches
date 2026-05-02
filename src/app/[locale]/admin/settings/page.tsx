"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Check, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const DEFAULTS = {
  hero_image: "",
  about_image: "",
  about_heading: "Né d'un rêve,\ngrandi avec vous",
  about_p1: "Ziziwatches n'est pas née comme une simple entreprise… mais comme un rêve.",
  about_p2: "Le rêve d'un jeune homme, Ibrahim Zizi, convaincu que l'élégance ne doit pas être réservée à une élite, et que chacun mérite de porter une montre qui reflète sa personnalité avec confiance.",
  about_p3: "De ce rêve est née Ziziwatches, avec une vision claire : proposer des montres et accessoires de qualité, au design élégant, à des prix accessibles.",
  about_p4: "Chaque pièce ici n'est pas qu'un produit, mais une étape dans un parcours ambitieux, porté par une passion sincère pour offrir le meilleur.",
  about_p5: "Aujourd'hui, ce rêve continue avec vous… Il grandit grâce à votre confiance, vos choix, et chaque moment où vous décidez de vous démarquer.",
  about_quote: "Ziziwatches… un rêve né d'une personne, qui grandit avec vous.",
};

type SettingKey = keyof typeof DEFAULTS;

export default function AdminSettingsPage() {
  const [fields, setFields] = useState({ ...DEFAULTS });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setFields((prev) => {
          const merged = { ...prev };
          for (const key of Object.keys(DEFAULTS) as SettingKey[]) {
            if (data[key]) merged[key] = data[key];
          }
          return merged;
        });
      });
  }, []);

  const set = (key: SettingKey, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const handleUpload = async (file: File, target: "hero_image" | "about_image") => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set(target, data.url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";
  const labelClass = "block text-foreground/50 text-xs tracking-wider uppercase mb-1";
  const taClass = inputClass + " resize-none";

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
        <h1 className="luxury-heading text-3xl font-light text-foreground">Paramètres</h1>
      </div>

      <div className="bg-surface border border-border p-6 space-y-6">

        {/* Hero image */}
        <h2 className="text-foreground/70 text-xs tracking-[0.2em] uppercase font-medium border-b border-border pb-3">
          Page d&apos;accueil — Photo Montre (mobile)
        </h2>
        <div>
          <label className={labelClass}>Photo montre (fond transparent sur mobile)</label>
          <div className="relative aspect-square w-32 bg-background border border-border overflow-hidden mb-3">
            {fields.hero_image ? (
              <Image src={fields.hero_image} alt="Hero" fill className="object-cover" sizes="128px" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/20 gap-2">
                <ImageIcon size={20} />
                <span className="text-xs">Aucune image</span>
              </div>
            )}
          </div>
          <input ref={heroFileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "hero_image"); }} />
          <button type="button" onClick={() => heroFileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 text-xs text-foreground/50 hover:text-gold border border-dashed border-border hover:border-gold/40 px-4 py-2 transition-colors disabled:opacity-40">
            {uploading ? <><Loader2 size={12} className="animate-spin" /> Téléchargement...</> : <><Upload size={12} /> Choisir une photo</>}
          </button>
        </div>
        <div>
          <label className={labelClass}>Ou coller une URL</label>
          <input type="text" value={fields.hero_image} onChange={(e) => set("hero_image", e.target.value)}
            placeholder="https://..." className={inputClass} />
        </div>

        <h2 className="text-foreground/70 text-xs tracking-[0.2em] uppercase font-medium border-b border-border pb-3 pt-2">
          Page À Propos — Photo
        </h2>

        {/* Image preview */}
        <div>
          <label className={labelClass}>Photo principale</label>
          <div className="relative aspect-[4/5] w-40 bg-background border border-border overflow-hidden mb-3">
            {fields.about_image ? (
              <Image src={fields.about_image} alt="About" fill className="object-cover" sizes="160px" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/20 gap-2">
                <ImageIcon size={22} />
                <span className="text-xs">Aucune image</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f, "about_image"); }} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 text-xs text-foreground/50 hover:text-gold border border-dashed border-border hover:border-gold/40 px-4 py-2 transition-colors disabled:opacity-40">
            {uploading ? <><Loader2 size={12} className="animate-spin" /> Téléchargement...</> : <><Upload size={12} /> Changer la photo</>}
          </button>
        </div>

        <div>
          <label className={labelClass}>Ou coller une URL</label>
          <input type="text" value={fields.about_image} onChange={(e) => set("about_image", e.target.value)}
            placeholder="https://..." className={inputClass} />
        </div>

        {/* Story text */}
        <h2 className="text-foreground/70 text-xs tracking-[0.2em] uppercase font-medium border-b border-border pb-3 pt-2">
          Page À Propos — Texte
        </h2>

        <div>
          <label className={labelClass}>Titre principal</label>
          <textarea rows={2} value={fields.about_heading}
            onChange={(e) => set("about_heading", e.target.value)} className={taClass} />
          <p className="text-foreground/25 text-[10px] mt-1">Utilisez une nouvelle ligne pour créer un saut de ligne</p>
        </div>

        {(["about_p1", "about_p2", "about_p3", "about_p4", "about_p5"] as SettingKey[]).map((key, i) => (
          <div key={key}>
            <label className={labelClass}>Paragraphe {i + 1}</label>
            <textarea rows={3} value={fields[key]}
              onChange={(e) => set(key, e.target.value)} className={taClass} />
          </div>
        ))}

        <div>
          <label className={labelClass}>Citation finale</label>
          <textarea rows={2} value={fields.about_quote}
            onChange={(e) => set("about_quote", e.target.value)} className={taClass} />
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving}
          className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Enregistrement...</>
            : saved ? <><Check size={14} /> Enregistré !</>
            : "Enregistrer tout"}
        </button>
      </div>
    </div>
  );
}
