"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Review = {
  id: string;
  customerName: string;
  city: string | null;
  rating: number;
  comment: string | null;
  approvedAt: string;
};

const GOLD = "#c9a84c";
const OLIVE = "#4a5240";

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={s <= rating ? GOLD : "transparent"}
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (review.comment?.length ?? 0) > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-background border border-border/50 p-6 flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm text-foreground">{review.customerName}</p>
          {review.city && (
            <p className="text-[11px] text-foreground/35 mt-0.5">{review.city}</p>
          )}
        </div>
        <Stars rating={review.rating} />
      </div>

      {/* Verified badge */}
      <div className="flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill={OLIVE} />
          <polyline points="3,6 5,8.5 9,3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[10px] tracking-wide text-foreground/40" style={{ fontStyle: "italic" }}>
          Client vérifié
        </span>
      </div>

      {/* Comment */}
      {review.comment && (
        <div>
          <p className="text-sm text-foreground/60 leading-relaxed">
            {isLong && !expanded
              ? review.comment.slice(0, 120) + "…"
              : review.comment}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[11px] mt-1 underline text-foreground/40 hover:text-foreground/60 transition-colors"
            >
              {expanded ? "Voir moins" : "Lire plus"}
            </button>
          )}
        </div>
      )}

      {/* Date */}
      <p className="text-[10px] text-foreground/25 mt-auto pt-1">
        {format(new Date(review.approvedAt), "d MMMM yyyy", { locale: fr })}
      </p>
    </motion.div>
  );
}

export default function ProductReviews({ reviews }: { reviews: Review[] }) {
  const avg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="border-t border-border/40 section-padding py-14 lg:py-20">
      <div className="max-w-7xl mx-auto">

        {/* Heading row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
          <div className="flex items-center gap-5 flex-1">
            <h2 className="text-sm font-semibold tracking-[0.3em] uppercase text-olive whitespace-nowrap">
              Avis Clients
            </h2>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {reviews.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <Stars rating={Math.round(avg)} size={15} />
              <span className="text-sm font-medium text-foreground/70">
                {avg.toFixed(1)}
              </span>
              <span className="text-sm text-foreground/35">
                ({reviews.length} avis)
              </span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 border border-border/40 bg-surface/50">
            <p className="text-foreground/30 text-sm tracking-wide">
              Aucun avis pour ce produit pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
