"use client";

import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface AttributeData {
  keyFr: string;
  keyEn: string;
  keyAr: string;
  valueFr: string;
  valueEn: string;
  valueAr: string;
}

interface Props {
  value: AttributeData[];
  onChange: (attrs: AttributeData[]) => void;
}

const blank = (): AttributeData => ({
  keyFr: "", keyEn: "", keyAr: "",
  valueFr: "", valueEn: "", valueAr: "",
});

const inputClass =
  "w-full bg-background border border-border text-foreground px-2 py-1.5 text-xs focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/25";

export default function AttributeEditor({ value, onChange }: Props) {
  const [expanded, setExpanded] = useState<number[]>([]);

  const add = () => {
    const newAttrs = [...value, blank()];
    onChange(newAttrs);
    setExpanded((e) => [...e, newAttrs.length - 1]);
  };

  const remove = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
    setExpanded((e) => e.filter((n) => n !== i).map((n) => (n > i ? n - 1 : n)));
  };

  const update = (i: number, field: keyof AttributeData, val: string) => {
    onChange(value.map((attr, idx) => (idx === i ? { ...attr, [field]: val } : attr)));
  };

  const toggleExpand = (i: number) => {
    setExpanded((e) => (e.includes(i) ? e.filter((n) => n !== i) : [...e, i]));
  };

  return (
    <div className="space-y-2">
      {value.length === 0 && (
        <p className="text-foreground/25 text-xs italic py-1">Aucune caractéristique ajoutée</p>
      )}

      {value.map((attr, i) => {
        const isOpen = expanded.includes(i);
        const hasContent = attr.keyFr || attr.valueFr;

        return (
          <div key={i} className="border border-border">
            {/* Header row */}
            <div className="flex items-center gap-2 px-3 py-2 bg-surface">
              <button
                type="button"
                onClick={() => toggleExpand(i)}
                className="flex-1 flex items-center gap-2 text-left"
              >
                <span className="text-foreground/60 text-xs font-medium truncate">
                  {hasContent
                    ? <>{attr.keyFr || <span className="text-foreground/30 italic">clé FR</span>} → {attr.valueFr || <span className="text-foreground/30 italic">valeur FR</span>}</>
                    : <span className="text-foreground/30 italic">Nouvelle caractéristique</span>
                  }
                </span>
                {isOpen ? <ChevronUp size={12} className="text-foreground/30 shrink-0" /> : <ChevronDown size={12} className="text-foreground/30 shrink-0" />}
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-foreground/25 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Expanded fields */}
            {isOpen && (
              <div className="p-3 space-y-3 border-t border-border">
                {/* FR */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">Clé (FR)</p>
                    <input
                      value={attr.keyFr}
                      onChange={(e) => update(i, "keyFr", e.target.value)}
                      placeholder="ex: Mouvement"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">Valeur (FR)</p>
                    <input
                      value={attr.valueFr}
                      onChange={(e) => update(i, "valueFr", e.target.value)}
                      placeholder="ex: Quartz"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* EN */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">Key (EN)</p>
                    <input
                      value={attr.keyEn}
                      onChange={(e) => update(i, "keyEn", e.target.value)}
                      placeholder="ex: Movement"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">Value (EN)</p>
                    <input
                      value={attr.valueEn}
                      onChange={(e) => update(i, "valueEn", e.target.value)}
                      placeholder="ex: Quartz"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* AR */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">المفتاح (AR)</p>
                    <input
                      dir="rtl"
                      value={attr.keyAr}
                      onChange={(e) => update(i, "keyAr", e.target.value)}
                      placeholder="مثال: الحركة"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">القيمة (AR)</p>
                    <input
                      dir="rtl"
                      value={attr.valueAr}
                      onChange={(e) => update(i, "valueAr", e.target.value)}
                      placeholder="مثال: كوارتز"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-gold border border-dashed border-border hover:border-gold/40 px-3 py-2 w-full transition-colors"
      >
        <Plus size={12} />
        Ajouter une caractéristique
      </button>
    </div>
  );
}
