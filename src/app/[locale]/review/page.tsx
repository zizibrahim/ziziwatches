"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Star, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ValidationData = {
  customerName: string;
  orderNumber: string | null;
  productName: string | null;
  productImage: string | null;
};

type State = "loading" | "invalid" | "used" | "form" | "submitting" | "success";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<State>("loading");
  const [data, setData] = useState<ValidationData | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }

    fetch(`/api/review/validate?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) {
          setData(d);
          setState("form");
        } else if (d.error?.includes("déjà été utilisé") || d.error?.includes("expiré")) {
          setState("used");
        } else {
          setState("invalid");
        }
      })
      .catch(() => setState("invalid"));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Veuillez sélectionner une note."); return; }
    setState("submitting");

    const res = await fetch("/api/review/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, rating, comment: comment.trim() || undefined }),
    });

    if (res.ok) {
      setState("success");
    } else {
      const d = await res.json();
      setError(d.error ?? "Une erreur s'est produite.");
      setState("form");
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-16">
      <AnimatePresence mode="wait">

        {state === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-foreground/40">
            <Loader2 size={32} className="animate-spin text-gold" />
            <p className="text-sm tracking-widest uppercase">Chargement…</p>
          </motion.div>
        )}

        {(state === "invalid" || state === "used") && (
          <motion.div key="invalid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center max-w-md space-y-5">
            <XCircle size={52} className="mx-auto text-red-400/60" />
            <h1 className="luxury-heading text-2xl text-foreground">
              {state === "used" ? "Lien déjà utilisé" : "Lien invalide"}
            </h1>
            <p className="text-foreground/40 text-sm leading-relaxed">
              {state === "used"
                ? "Cet avis a déjà été soumis. Chaque lien n'est utilisable qu'une seule fois."
                : "Ce lien est invalide ou a expiré. Contactez-nous si vous avez besoin d'aide."}
            </p>
            <Link href="/fr" className="inline-block mt-2 text-gold text-xs tracking-[0.2em] uppercase hover:underline">
              Retour à la boutique
            </Link>
          </motion.div>
        )}

        {(state === "form" || state === "submitting") && data && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="w-full max-w-lg">

            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-3">Votre avis compte</p>
              <h1 className="luxury-heading text-3xl font-light text-foreground">
                Bonjour, {data.customerName.split(" ")[0]}
              </h1>
              {data.orderNumber && (
                <p className="text-foreground/30 text-xs mt-2 font-mono">Commande {data.orderNumber}</p>
              )}
            </div>

            {/* Product card */}
            {(data.productName || data.productImage) && (
              <div className="flex items-center gap-4 bg-surface border border-border p-4 mb-6">
                {data.productImage && (
                  <div className="relative w-16 h-16 shrink-0">
                    <Image src={data.productImage} alt={data.productName ?? ""} fill className="object-cover" />
                  </div>
                )}
                {data.productName && (
                  <p className="text-foreground text-sm">{data.productName}</p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star rating */}
              <div className="bg-surface border border-border p-6 text-center">
                <p className="text-foreground/40 text-xs tracking-[0.2em] uppercase mb-4">
                  Note globale <span className="text-red-400">*</span>
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(s)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={36}
                        className={`transition-colors ${
                          s <= (hovered || rating)
                            ? "fill-gold text-gold"
                            : "fill-transparent text-foreground/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-gold text-xs mt-3">
                    {["", "Très mauvais", "Mauvais", "Correct", "Bien", "Excellent"][rating]}
                  </p>
                )}
              </div>

              {/* Comment */}
              <div className="bg-surface border border-border p-6">
                <label className="text-foreground/40 text-xs tracking-[0.2em] uppercase block mb-3">
                  Votre commentaire <span className="text-foreground/20">(optionnel)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Partagez votre expérience avec cette montre…"
                  className="w-full bg-background border border-border text-foreground text-sm p-3 resize-none focus:outline-none focus:border-gold/50 placeholder:text-foreground/20 transition-colors"
                />
                <p className="text-foreground/20 text-xs text-right mt-1">{comment.length}/1000</p>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full bg-gold text-[#050505] text-xs tracking-[0.3em] uppercase py-4 font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state === "submitting" ? (
                  <><Loader2 size={14} className="animate-spin" /> Envoi en cours…</>
                ) : "Soumettre mon avis"}
              </button>

              <p className="text-center text-foreground/20 text-[10px]">
                Votre avis sera visible après validation par notre équipe.
              </p>
            </form>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="text-center max-w-md space-y-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
              <CheckCircle size={56} className="mx-auto text-gold" />
            </motion.div>
            <div>
              <h1 className="luxury-heading text-3xl font-light text-foreground mb-3">Merci !</h1>
              <p className="text-foreground/50 text-sm leading-relaxed">
                Votre avis a bien été reçu et sera publié après validation.<br />
                Nous apprécions votre confiance.
              </p>
            </div>
            <Link
              href="/fr"
              className="inline-block border border-gold/40 text-gold text-xs tracking-[0.3em] uppercase px-8 py-3 hover:bg-gold/5 transition-colors"
            >
              Découvrir nos montres
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
