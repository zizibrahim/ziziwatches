"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImage {
  url: string;
  altFr?: string | null;
}

export default function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeImage = images[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (!images.length) {
    return (
      <div className="aspect-square bg-surface border border-border flex items-center justify-center text-foreground/20">
        <span className="text-xs tracking-wider uppercase">No image</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image — diamond frame */}
        <div
          className="relative aspect-square flex items-center justify-center cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          {/* Diamond container */}
          <div
            className="relative overflow-hidden"
            style={{
              width: "82%",
              height: "82%",
              borderRadius: "18%",
              transform: "rotate(45deg)",
              background: "linear-gradient(135deg, rgba(180,200,255,0.18) 0%, rgba(120,140,220,0.10) 100%)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 24px 72px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(255,255,255,0.20)",
            }}
          >
            {/* Counter-rotated image */}
            <div className="absolute inset-0" style={{ transform: "rotate(-45deg) scale(1.42)" }}>
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeImage.url}
                      alt={activeImage.altFr ?? productName}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Inner highlight */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 35%)",
                borderRadius: "inherit",
              }}
            />
            {/* Inner border */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ borderRadius: "inherit", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)" }}
            />
          </div>

          {/* Arrow nav — positioned on the sides of the outer square */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border text-foreground/60 hover:text-foreground p-2 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border text-foreground/60 hover:text-foreground p-2 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-2 right-1/2 translate-x-1/2 bg-black/40 p-1.5 opacity-50 hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn size={12} className="text-white" />
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square bg-surface overflow-hidden border-2 transition-colors ${
                  i === activeIndex ? "border-gold" : "border-transparent hover:border-border"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altFr ?? productName}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/60 hover:text-white z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Image */}
            <motion.div
              className="relative w-full max-w-3xl max-h-[85vh] mx-4 aspect-square"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage.url}
                    alt={activeImage.altFr ?? productName}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Lightbox arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-gold" : "bg-white/30"}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
