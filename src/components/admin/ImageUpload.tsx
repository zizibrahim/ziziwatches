"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, Link } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Fichier invalide. Choisissez une image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image trop lourde (max 10 Mo).");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur d'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {value ? (
        /* Preview with replace/remove */
        <div className="flex items-start gap-4">
          <div className="relative w-28 h-28 bg-surface border border-border overflow-hidden shrink-0">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="112px" />
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 text-xs text-foreground/60 hover:text-gold transition-colors border border-border hover:border-gold/40 px-3 py-1.5"
            >
              <Upload size={12} /> Remplacer l'image
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-2 text-xs text-foreground/40 hover:text-red-400 transition-colors"
            >
              <X size={12} /> Supprimer
            </button>
          </div>
        </div>
      ) : (
        /* Upload zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-36 border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
            dragging
              ? "border-gold bg-gold/5 text-gold"
              : "border-border text-foreground/40 hover:border-gold/50 hover:bg-gold/5 hover:text-foreground/70"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-gold" />
              <span className="text-xs text-gold">Upload en cours…</span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
                <ImageIcon size={18} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Cliquer pour choisir une image</p>
                <p className="text-xs text-foreground/30 mt-0.5">ou glisser-déposer · JPG, PNG, WEBP · max 10 Mo</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* URL fallback — collapsed by default */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrl((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] text-foreground/25 hover:text-foreground/50 transition-colors"
        >
          <Link size={11} />
          {showUrl ? "Masquer" : "Utiliser une URL à la place"}
        </button>
        {showUrl && (
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="mt-2 w-full bg-background border border-border text-foreground/70 px-3 py-2 text-xs focus:outline-none focus:border-gold transition-colors"
          />
        )}
      </div>
    </div>
  );
}
