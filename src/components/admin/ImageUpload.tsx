"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
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
    <div className="space-y-2">
      {value ? (
        /* Preview */
        <div className="relative w-full aspect-square max-w-[200px] bg-surface border border-border overflow-hidden group">
          <Image src={value} alt="Preview" fill className="object-cover" sizes="200px" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/20 hover:bg-white/30 text-white p-2 transition-colors"
              title="Remplacer"
            >
              <Upload size={14} />
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-white/20 hover:bg-red-500/60 text-white p-2 transition-colors"
              title="Supprimer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full aspect-square max-w-[200px] border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragging
              ? "border-gold bg-gold/5 text-gold"
              : "border-border text-foreground/30 hover:border-gold/40 hover:text-foreground/50"
          }`}
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin text-gold" />
          ) : (
            <>
              <ImageIcon size={20} />
              <span className="text-xs text-center px-2">
                Glisser une image<br />ou cliquer
              </span>
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

      {uploading && (
        <p className="text-gold text-xs flex items-center gap-1.5">
          <Loader2 size={11} className="animate-spin" /> Upload en cours…
        </p>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Manual URL fallback */}
      <div>
        <p className="text-foreground/30 text-[10px] uppercase tracking-wider mb-1">ou URL directe</p>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-background border border-border text-foreground/70 px-3 py-1.5 text-xs focus:outline-none focus:border-gold transition-colors"
        />
      </div>
    </div>
  );
}
