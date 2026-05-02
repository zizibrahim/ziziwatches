"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Play, ImagePlus } from "lucide-react";

export interface MediaItem {
  url: string;
  altFr?: string;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

interface Props {
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

export default function MediaGalleryUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | File[]) => {
    setError("");
    setUploading(true);
    const newItems: MediaItem[] = [];

    for (const file of Array.from(files)) {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");

      if (!isImg && !isVid) {
        setError("Seules les images et vidéos sont acceptées.");
        continue;
      }
      const maxSize = isVid ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(isVid ? "Vidéo trop lourde (max 200 Mo)." : "Image trop lourde (max 10 Mo).");
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Upload failed");
        newItems.push({ url: data.url });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur d'upload.");
      }
    }

    setUploading(false);
    if (newItems.length > 0) {
      onChange([...value, ...newItems]);
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) upload(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingOver(false);
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveRight = (index: number) => {
    if (index === value.length - 1) return;
    const next = [...value];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">

      {/* Grid of current media — images only, no button inside */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((item, i) => (
            <div key={item.url + i} className="relative group">
              {/* Thumbnail */}
              <div className="relative aspect-square bg-surface border border-border overflow-hidden">
                {isVideo(item.url) ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={16} className="text-white" fill="white" />
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.altFr ?? `Media ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="15vw"
                  />
                )}

                {/* Badge: main */}
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[8px] bg-gold text-black px-1 py-0.5 font-bold tracking-wide uppercase">
                    Principal
                  </span>
                )}

                {/* Video badge */}
                {isVideo(item.url) && i !== 0 && (
                  <span className="absolute top-1 left-1 text-[8px] bg-black/60 text-white px-1 py-0.5 uppercase tracking-wide">
                    Vidéo
                  </span>
                )}
              </div>

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                {/* Delete */}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex items-center gap-1 text-[10px] text-white bg-red-500/80 hover:bg-red-500 px-2 py-1 transition-colors"
                >
                  <X size={10} /> Supprimer
                </button>

                {/* Move left/right */}
                <div className="flex gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveLeft(i)}
                      className="text-[9px] text-white/80 bg-white/20 hover:bg-white/30 px-1.5 py-0.5 transition-colors"
                    >
                      ←
                    </button>
                  )}
                  {i < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveRight(i)}
                      className="text-[9px] text-white/80 bg-white/20 hover:bg-white/30 px-1.5 py-0.5 transition-colors"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty drop zone */}
      {value.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-40 border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all select-none ${
            draggingOver
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
                <Upload size={18} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Cliquer ou glisser des fichiers</p>
                <p className="text-xs text-foreground/30 mt-0.5">
                  Images (JPG, PNG, WEBP · max 10 Mo) · Vidéos (MP4, WEBM · max 200 Mo)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Add more button — always below the grid, never inside it */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-full flex items-center justify-center gap-2 border border-dashed py-2.5 text-xs transition-all ${
            draggingOver
              ? "border-gold bg-gold/5 text-gold"
              : "border-border/50 text-foreground/30 hover:border-gold/40 hover:text-gold"
          }`}
        >
          {uploading ? (
            <><Loader2 size={12} className="animate-spin" /> Upload en cours…</>
          ) : (
            <><ImagePlus size={13} /> Ajouter des photos ou une vidéo</>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {value.length > 0 && (
        <p className="text-foreground/25 text-[10px]">
          Le premier élément sera l'image principale · Survolez pour réordonner ou supprimer
        </p>
      )}
    </div>
  );
}
