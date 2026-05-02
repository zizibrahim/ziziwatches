"use client";

import { useState } from "react";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import MediaGalleryUpload, { type MediaItem } from "./MediaGalleryUpload";

export interface VariantData {
  id?: string;
  colorName: string;
  colorHex: string;
  stock: number;
  images: MediaItem[];
}

interface Props {
  value: VariantData[];
  onChange: (variants: VariantData[]) => void;
}

const PRESET_COLORS = [
  { name: "Noir", hex: "#1a1a1a" },
  { name: "Blanc", hex: "#f5f5f5" },
  { name: "Or", hex: "#C9A84C" },
  { name: "Argent", hex: "#C0C0C0" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Bleu", hex: "#1E3A5F" },
  { name: "Rouge", hex: "#8B0000" },
  { name: "Vert", hex: "#2D6A4F" },
];

export default function VariantEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const addVariant = () => {
    const next: VariantData = { colorName: "", colorHex: "#C9A84C", stock: 0, images: [] };
    onChange([...value, next]);
    setExpanded(value.length);
  };

  const removeVariant = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  const update = (i: number, patch: Partial<VariantData>) => {
    onChange(value.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  };

  const inputClass =
    "w-full bg-background border border-border text-foreground px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-foreground/30 text-xs italic">
          Aucune variante — le produit sera vendu sans option de couleur.
        </p>
      )}

      {value.map((variant, i) => (
        <div key={i} className="border border-border bg-surface">
          {/* Header row */}
          <div
            className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            {/* Color swatch */}
            <div
              className="w-5 h-5 rounded-full border border-border shrink-0"
              style={{ background: variant.colorHex || "#888" }}
            />
            <span className="text-foreground/80 text-sm flex-1 truncate">
              {variant.colorName || <span className="text-foreground/30 italic">Nom de la couleur…</span>}
            </span>
            <span className="text-foreground/30 text-xs">Stock: {variant.stock}</span>
            <span className="text-foreground/30 text-xs">{variant.images.length} photo{variant.images.length !== 1 ? "s" : ""}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeVariant(i); }}
              className="text-foreground/20 hover:text-red-400 transition-colors ml-1"
            >
              <X size={14} />
            </button>
            {expanded === i ? <ChevronUp size={14} className="text-foreground/30" /> : <ChevronDown size={14} className="text-foreground/30" />}
          </div>

          {/* Expanded body */}
          {expanded === i && (
            <div className="px-4 pb-4 space-y-4 border-t border-border">
              <div className="grid grid-cols-2 gap-3 pt-4">
                {/* Color name */}
                <div>
                  <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-1">
                    Nom de la couleur
                  </label>
                  <input
                    type="text"
                    value={variant.colorName}
                    onChange={(e) => update(i, { colorName: e.target.value })}
                    placeholder="Ex: Noir, Or, Argent…"
                    className={inputClass}
                  />
                  {/* Presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => update(i, { colorName: c.name, colorHex: c.hex })}
                        className="flex items-center gap-1 text-[10px] border border-border px-1.5 py-0.5 hover:border-gold/50 transition-colors text-foreground/50 hover:text-foreground/80"
                      >
                        <span className="w-2.5 h-2.5 rounded-full inline-block border border-border/50" style={{ background: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hex + stock */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-1">
                      Couleur (hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variant.colorHex || "#C9A84C"}
                        onChange={(e) => update(i, { colorHex: e.target.value })}
                        className="w-10 h-9 cursor-pointer border border-border bg-background p-0.5"
                      />
                      <input
                        type="text"
                        value={variant.colorHex}
                        onChange={(e) => update(i, { colorHex: e.target.value })}
                        placeholder="#C9A84C"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => update(i, { stock: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Images for this variant */}
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">
                  Photos & vidéos de cette couleur
                </label>
                <MediaGalleryUpload
                  value={variant.images}
                  onChange={(imgs) => update(i, { images: imgs })}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addVariant}
        className="flex items-center gap-2 text-xs text-foreground/40 hover:text-gold border border-dashed border-border hover:border-gold/40 px-4 py-2.5 w-full justify-center transition-colors"
      >
        <Plus size={13} />
        Ajouter une variante de couleur
      </button>
    </div>
  );
}
