"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  approvedAt: string;
  product: { nameFr: string } | null;
};

const OLIVE = "#4a5240";
const GOLD  = "#c9a84c";

// Section height drives everything — olive panel is this wide = square
const H = 320;

function StarIcon({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={filled ? GOLD : "transparent"}
        stroke={GOLD}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FractionalStar({ fill, size = 20 }: { fill: number; size?: number }) {
  const pct = `${Math.round(fill * 100)}%`;
  const gid = `fs${pct.replace("%", "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gid}>
          <stop offset={pct} stopColor="white" />
          <stop offset={pct} stopColor="white" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={`url(#${gid})`}
        stroke="white"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25 }}
        className="bg-white w-full max-w-lg relative"
        style={{ borderTop: `4px solid ${OLIVE}`, padding: "36px 40px 32px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-foreground/20 hover:bg-foreground/5 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Name + stars */}
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontFamily: "Georgia, serif", fontSize: 17, color: OLIVE, fontWeight: 700 }}>
            {review.customerName}
          </span>
          <span className="flex gap-[3px]">
            {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= review.rating} size={15} />)}
          </span>
        </div>

        {/* Verified */}
        <div className="flex items-center gap-1.5 mb-4">
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="6" fill={OLIVE} />
            <polyline points="3,6 5,8.5 9,3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#999", fontStyle: "italic" }}>
            Client vérifié
          </span>
        </div>

        {/* Product */}
        {review.product && (
          <p style={{ fontFamily: "Georgia, serif", fontSize: 12, color: OLIVE, fontStyle: "italic", marginBottom: 14 }}>
            Produit : {review.product.nameFr}
          </p>
        )}

        {/* Full comment */}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#444", lineHeight: 1.85, marginBottom: 24 }}>
          {review.comment ?? "—"}
        </p>

        {/* Was this helpful? */}
        <div className="flex items-center gap-3 mb-5">
          <span style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#555" }}>
            Was this review helpful?
          </span>
          {helpful === null ? (
            <>
              <button
                onClick={() => setHelpful("yes")}
                style={{ fontFamily: "Georgia, serif", fontSize: 13, color: OLIVE, textDecoration: "underline" }}
                className="hover:opacity-70 transition-opacity"
              >
                Yes
              </button>
              <button
                onClick={() => setHelpful("no")}
                style={{ fontFamily: "Georgia, serif", fontSize: 13, color: OLIVE, textDecoration: "underline" }}
                className="hover:opacity-70 transition-opacity"
              >
                No
              </button>
            </>
          ) : (
            <span style={{ fontFamily: "Georgia, serif", fontSize: 12, color: "#999", fontStyle: "italic" }}>
              {helpful === "yes" ? "Thanks for your feedback!" : "Sorry to hear that."}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#eee", marginBottom: 16 }} />

        {/* Date */}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#bbb", textAlign: "right" }}>
          {format(new Date(review.approvedAt), "d MMMM yyyy", { locale: fr })}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ReviewCard({ review, onClick }: { review: Review; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white shrink-0 flex flex-col shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-300"
      style={{
        borderTop: `3px solid ${OLIVE}`,
        width: 370,
        height: "100%",
        padding: "18px 22px",
      }}
    >
      {/* Name + stars */}
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ fontFamily: "Georgia, serif", fontSize: 15.5, color: "#1a1a1a", fontWeight: 600 }}>
          {review.customerName}
        </span>
        <span className="flex gap-[2px]">
          {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= review.rating} size={14} />)}
        </span>
      </div>

      {/* Verified */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill={OLIVE} />
          <polyline points="3,6 5,8.5 9,3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 11.5, color: "#999", fontStyle: "italic" }}>
          Client vérifié
        </span>
      </div>

      {/* Product */}
      {review.product && (
        <p style={{ fontFamily: "Georgia, serif", fontSize: 11.5, color: OLIVE, fontStyle: "italic", marginBottom: 10 }}>
          {review.product.nameFr}
        </p>
      )}

      {/* Comment — flex-1 so it fills remaining height */}
      <p
        className="flex-1 overflow-hidden"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 13.5,
          color: "#555",
          lineHeight: 1.8,
          display: "-webkit-box",
          WebkitLineClamp: 5,
          WebkitBoxOrient: "vertical",
        } as React.CSSProperties}
      >
        {review.comment ?? "—"}
      </p>

      {/* Date + read more hint */}
      <div className="flex items-center justify-between mt-2.5">
        <span style={{ fontFamily: "Georgia, serif", fontSize: 10, color: OLIVE, opacity: 0.6 }}>
          Lire plus →
        </span>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 10, color: "#ccc" }}>
          {format(new Date(review.approvedAt), "d MMM yyyy", { locale: fr })}
        </p>
      </div>
    </div>
  );
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const [paused,   setPaused]   = useState(false);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const [selected, setSelected] = useState<Review | null>(null);

  const CARD_W = 386;

  const avg   = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const label = avg >= 4.5 ? "Excellent" : avg >= 3.5 ? "Très bien" : avg >= 2.5 ? "Bien" : "Correct";

  function syncArrows() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  function slide(dir: number) {
    trackRef.current?.scrollBy({ left: dir * CARD_W * 2, behavior: "smooth" });
    setTimeout(syncArrows, 350);
  }

  useEffect(() => {
    if (paused || !reviews.length) return;
    timerRef.current = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      el.scrollBy({ left: atEnd ? -el.scrollWidth : CARD_W, behavior: "smooth" });
      setTimeout(syncArrows, 350);
    }, 3400);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, reviews.length]);

  if (!reviews.length) return null;

  return (
    <>
      <AnimatePresence>
        {selected && (
          <ReviewModal review={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
      {/* Title — white background, outside section */}
      <div className="bg-white text-center py-10">
        <h2 style={{
          fontFamily: "Georgia, serif",
          fontSize: "clamp(20px, 2.5vw, 34px)",
          fontWeight: 200,
          fontStyle: "italic",
          color: "#1a1a1a",
          letterSpacing: "0.16em",
        }}>
          Customer Reviews
        </h2>
        <div className="mx-auto mt-4" style={{ width: 44, height: 1, background: GOLD }} />
      </div>

      {/* Carousel */}
      <section style={{ background: "#f0ede6" }} className="overflow-hidden">
        {/* Fixed height row — olive width = H = square */}
        <div className="flex" style={{ height: H }}>

          {/* ── Olive square panel ── */}
          <div
            className="hidden sm:flex flex-col items-center justify-center shrink-0"
            style={{ background: OLIVE, width: H, gap: 10 }}
          >
            <p style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "white", letterSpacing: "0.04em" }}>
              {label}
            </p>

            <div className="flex items-center gap-[3px]">
              {[1,2,3,4,5].map(s => (
                <FractionalStar key={s} fill={Math.min(1, Math.max(0, avg - (s - 1)))} size={22} />
              ))}
            </div>

            <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
              {avg.toFixed(2)} moyenne
            </p>

            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.2)", margin: "2px 0" }} />

            {/* Brand badge — white only */}
            <div className="flex flex-col items-center" style={{ gap: 5 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <polygon
                    points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                    fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: "white", letterSpacing: "0.28em", lineHeight: 1 }}>
                ZIZI
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 7, color: "rgba(255,255,255,0.45)", letterSpacing: "0.5em" }}>
                WATCHES
              </p>
            </div>
          </div>

          {/* ── Right carousel — equal padding top & bottom ── */}
          <div className="flex-1 min-w-0 relative">

            {/* Mobile bar */}
            <div className="sm:hidden flex items-center gap-3 px-5 py-3" style={{ background: OLIVE }}>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.round(avg)} size={12} />)}</div>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{avg.toFixed(1)}</span>
              <span className="ml-auto" style={{ fontFamily: "Georgia, serif", color: "white", fontSize: 13, fontWeight: 600 }}>{label}</span>
            </div>

            {/* Left arrow */}
            <button onClick={() => slide(-1)} disabled={!canLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-0">
              <ChevronLeft size={16} color="#666" />
            </button>

            {/* Cards track — symmetric py so cards are centered vertically */}
            <div
              ref={trackRef}
              onScroll={syncArrows}
              className="flex gap-4 overflow-x-auto px-10"
              style={{
                scrollbarWidth: "none",
                height: "100%",
                alignItems: "stretch",
                paddingTop: 14,
                paddingBottom: 14,
              } as React.CSSProperties}
            >
              {reviews.map(r => <ReviewCard key={r.id} review={r} onClick={() => setSelected(r)} />)}
              <div className="w-2 shrink-0" />
            </div>

            {/* Right arrow */}
            <button onClick={() => slide(1)} disabled={!canRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-0">
              <ChevronRight size={16} color="#666" />
            </button>

            {/* Pause */}
            <button
              onClick={() => setPaused(p => !p)}
              className="absolute bottom-2 right-5 flex items-center gap-1.5"
              style={{ color: "#aaa", fontSize: 11, fontFamily: "Georgia, serif" }}
            >
              {paused
                ? <><Play size={9} fill="#aaa" /> Reprendre</>
                : <><Pause size={9} fill="#aaa" /> Pause</>}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
