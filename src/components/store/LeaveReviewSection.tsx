"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const OLIVE = "#4a5240";
const GOLD  = "#c9a84c";

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={(hovered || value) >= s ? GOLD : "transparent"}
              stroke={GOLD}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

type Step = "gate" | "form" | "notCustomer" | "success";

function ReviewModal({ onClose, productId }: { onClose: () => void; productId?: string }) {
  const [step, setStep]       = useState<Step>("gate");
  const [name, setName]       = useState("");
  const [city, setCity]       = useState("");
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) { setError("Veuillez choisir une note."); return; }
    if (comment.trim().length < 5) { setError("Le commentaire est trop court."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/review/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          city: city.trim(),
          rating,
          comment: comment.trim(),
          ...(productId ? { productId } : {}),
        }),
      });
      if (!res.ok) throw new Error();
      setStep("success");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-lg relative overflow-y-auto"
        style={{ borderTop: `4px solid ${OLIVE}`, padding: "40px 44px 36px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-foreground/20 hover:bg-foreground/5 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Modal heading */}
        <p className="text-[10px] tracking-[0.4em] uppercase mb-1" style={{ color: GOLD, fontFamily: "Georgia, serif" }}>
          Votre avis
        </p>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 400, fontStyle: "italic", color: "#1a1a1a", marginBottom: 6 }}>
          Partagez votre expérience
        </h3>
        <div style={{ width: 36, height: 1, background: GOLD, marginBottom: 28 }} />

        <AnimatePresence mode="wait">

          {/* ── Gate ── */}
          {step === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 28 }}>
                Avez-vous déjà acheté un produit Ziziwatches ?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 py-3 text-white text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
                  style={{ background: OLIVE, fontFamily: "Georgia, serif", letterSpacing: "0.2em" }}
                >
                  Oui, j&apos;ai acheté
                </button>
                <button
                  onClick={() => setStep("notCustomer")}
                  className="flex-1 py-3 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
                  style={{ border: `1px solid ${OLIVE}`, color: OLIVE, fontFamily: "Georgia, serif", letterSpacing: "0.2em", background: "transparent" }}
                >
                  Pas encore
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Not a customer ── */}
          {step === "notCustomer" && (
            <motion.div
              key="notCustomer"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="text-center py-4"
            >
              <div
                className="mx-auto mb-5 flex items-center justify-center rounded-full"
                style={{ width: 52, height: 52, background: "rgba(201,168,76,0.1)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={GOLD} strokeWidth="1.5" />
                  <path d="M12 8V12M12 16H12.01" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 15, color: "#555", lineHeight: 1.85, marginBottom: 24 }}>
                Découvrez nos collections et revenez partager votre expérience après votre premier achat.
              </p>
              <a
                href="/fr/shop"
                className="inline-block px-8 py-3 text-white text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{ background: OLIVE, fontFamily: "Georgia, serif", letterSpacing: "0.2em" }}
              >
                Découvrir la boutique
              </a>
              <button
                onClick={() => setStep("gate")}
                className="block mx-auto mt-4 text-xs underline hover:opacity-60 transition-opacity"
                style={{ color: "#aaa", fontFamily: "Georgia, serif" }}
              >
                Retour
              </button>
            </motion.div>
          )}

          {/* ── Form ── */}
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <div>
                <label className="block mb-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: OLIVE, fontFamily: "Georgia, serif" }}>
                  Nom complet *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex. Sarah B."
                  className="w-full bg-transparent outline-none py-2 text-sm placeholder:text-black/20"
                  style={{ borderBottom: "1px solid #ddd", fontFamily: "Georgia, serif", color: "#333" }}
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: OLIVE, fontFamily: "Georgia, serif" }}>
                  Ville *
                </label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="ex. Casablanca"
                  className="w-full bg-transparent outline-none py-2 text-sm placeholder:text-black/20"
                  style={{ borderBottom: "1px solid #ddd", fontFamily: "Georgia, serif", color: "#333" }}
                />
              </div>

              <div>
                <label className="block mb-2 text-[10px] tracking-[0.2em] uppercase" style={{ color: OLIVE, fontFamily: "Georgia, serif" }}>
                  Note *
                </label>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: OLIVE, fontFamily: "Georgia, serif" }}>
                  Votre avis *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience…"
                  className="w-full bg-transparent outline-none p-3 text-sm resize-none placeholder:text-black/20"
                  style={{ border: "1px solid #ddd", fontFamily: "Georgia, serif", color: "#333" }}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500" style={{ fontFamily: "Georgia, serif" }}>{error}</p>
              )}

              <div className="flex items-center gap-5 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 text-white text-xs uppercase tracking-widest hover:opacity-80 disabled:opacity-50 transition-opacity"
                  style={{ background: OLIVE, fontFamily: "Georgia, serif", letterSpacing: "0.2em" }}
                >
                  {loading ? "Envoi…" : "Envoyer"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("gate")}
                  className="text-xs underline hover:opacity-60 transition-opacity"
                  style={{ color: "#aaa", fontFamily: "Georgia, serif" }}
                >
                  Retour
                </button>
              </div>

              <p className="text-[11px]" style={{ color: "#bbb", fontFamily: "Georgia, serif" }}>
                Votre avis sera vérifié par notre équipe avant publication.
              </p>
            </motion.form>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="text-center py-6"
            >
              <div
                className="mx-auto mb-6 flex items-center justify-center rounded-full"
                style={{ width: 60, height: 60, background: "rgba(74,82,64,0.08)" }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke={OLIVE} strokeWidth="1.5" />
                  <polyline points="7,12 10,15.5 17,8.5" stroke={OLIVE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 20, fontStyle: "italic", color: "#1a1a1a", marginBottom: 10 }}>
                Merci pour votre avis !
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#888", lineHeight: 1.85, marginBottom: 28 }}>
                Il sera publié après vérification par notre équipe.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 text-white text-xs uppercase tracking-widest hover:opacity-80 transition-opacity"
                style={{ background: OLIVE, fontFamily: "Georgia, serif", letterSpacing: "0.2em" }}
              >
                Fermer
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function LeaveReviewSection({ productId }: { productId?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>{open && <ReviewModal onClose={() => setOpen(false)} productId={productId} />}</AnimatePresence>

      <section className="border-t border-border/40 section-padding py-16 text-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h2 className="luxury-heading text-2xl font-light text-foreground mb-3">
            Partagez votre avis
          </h2>
          <p className="text-sm text-foreground/45 mb-8 leading-relaxed">
            Votre expérience compte — aidez d&apos;autres clients à bien choisir.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white hover:opacity-80 transition-opacity"
            style={{ background: OLIVE }}
          >
            Écrire un avis
          </button>
        </motion.div>
      </section>
    </>
  );
}
