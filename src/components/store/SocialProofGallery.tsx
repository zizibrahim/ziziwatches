"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

type SocialProofImage = {
  id: string;
  url: string;
  platform: string;
  caption: string | null;
};

const GOLD = "#c9a84c";

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === "instagram") {
    return (
      <span
        className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase text-white rounded-full"
        style={{ background: "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)" }}
      >
        Instagram
      </span>
    );
  }
  return (
    <span className="absolute top-2 right-2 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase text-white rounded-full bg-[#25d366]">
      WhatsApp
    </span>
  );
}

export default function SocialProofGallery({ images }: { images: SocialProofImage[] }) {
  const [lightbox, setLightbox] = useState<SocialProofImage | null>(null);

  if (!images.length) return null;

  return (
    <>
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={18} color="white" />
          </button>
          <div
            className="relative max-w-sm w-full"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? "Avis client"}
              width={400}
              height={700}
              className="object-contain rounded-sm shadow-2xl"
              style={{ maxHeight: "80vh", width: "auto", height: "auto", margin: "0 auto", display: "block" }}
            />
            {lightbox.caption && (
              <p className="text-white/70 text-center text-xs mt-3">{lightbox.caption}</p>
            )}
          </div>
        </div>
      )}

      <section className="py-16 px-0" style={{ background: "#f7f4ef" }}>
        {/* Heading */}
        <div className="text-center mb-10 px-6">
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: GOLD }}>
            Réseaux sociaux
          </p>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(20px, 2.5vw, 32px)",
              fontWeight: 200,
              fontStyle: "italic",
              color: "#1a1a1a",
              letterSpacing: "0.12em",
            }}
          >
            Ils parlent de nous
          </h2>
          <div className="mx-auto mt-4" style={{ width: 44, height: 1, background: GOLD }} />
        </div>

        {/* Uniform grid */}
        <div className="section-padding">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightbox(img)}
                className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Image
                  src={img.url}
                  alt={img.caption ?? "Avis client"}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <PlatformBadge platform={img.platform} />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/65 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-[11px] leading-snug">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
