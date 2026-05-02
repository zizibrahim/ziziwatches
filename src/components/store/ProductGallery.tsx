"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductImage {
  url: string;
  altFr?: string | null;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

export default function ProductGallery({
  images,
  productName,
  jumpToIndex,
}: {
  images: ProductImage[];
  productName: string;
  jumpToIndex?: number;
}) {
  const [active, setActive]   = useState(jumpToIndex ?? 0);
  const [lightbox, setLightbox] = useState(false);
  const prevJump = useRef(jumpToIndex);

  if (jumpToIndex !== undefined && jumpToIndex !== prevJump.current) {
    prevJump.current = jumpToIndex;
    setActive(jumpToIndex);
  }

  if (!images.length) return (
    <div className="aspect-square bg-surface border border-border flex items-center justify-center text-foreground/20 text-xs tracking-wider uppercase">
      No image
    </div>
  );

  const prev = () => setActive(i => i === 0 ? images.length - 1 : i - 1);
  const next = () => setActive(i => i === images.length - 1 ? 0 : i + 1);
  const current = images[active];

  return (
    <>
      <div className="flex flex-col gap-3">

        {/* ── Main image ── */}
        <div
          className="relative aspect-square overflow-hidden bg-surface group cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {isVideo(current.url) ? (
                <video src={current.url} autoPlay loop muted playsInline
                  className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <Image
                  src={current.url}
                  alt={current.altFr ?? productName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 bg-white/80 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={14} className="text-foreground/60" />
          </div>

          {/* Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={18} className="text-foreground/70" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={18} className="text-foreground/70" />
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-olive/30">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-16 h-16 overflow-hidden border-2 transition-all duration-200 ${
                  i === active
                    ? "border-olive"
                    : "border-transparent hover:border-border opacity-60 hover:opacity-100"
                }`}
              >
                {isVideo(img.url) ? (
                  <video src={img.url} muted className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Image src={img.url} alt={img.altFr ?? productName} fill className="object-cover" sizes="64px" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && !isVideo(current.url) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/92"
            onClick={() => setLightbox(false)}
          >
            <button onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl mx-6"
              style={{ maxHeight: "88vh", aspectRatio: "1/1" }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }} className="absolute inset-0">
                  <Image src={current.url} alt={current.altFr ?? productName} fill className="object-contain" sizes="90vw" />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={e => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={e => { e.stopPropagation(); setActive(i); }}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
