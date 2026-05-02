"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, CheckCircle } from "lucide-react";

const OLIVE = "#3d4535";
const GOLD  = "#c9b97a";

const FIELD = "w-full bg-transparent border-b-2 border-[#c8c0b0] px-0 py-3 text-base text-[#3d4535] placeholder:text-[#a09880] focus:outline-none focus:border-[#3d4535] transition-colors duration-200";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VipModal({ open, onClose }: Props) {
  const [name,    setName]    = useState("");
  const [city,    setCity]    = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");

  const reset = () => {
    setName(""); setCity(""); setContact("");
    setLoading(false); setDone(false); setError("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city, contact }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: "#f5f0e8" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gold top bar */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${GOLD}, #e8d48a, ${GOLD})` }} />

              <button
                onClick={handleClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                style={{ color: OLIVE }}
              >
                <X size={16} />
              </button>

              {done ? (
                /* Success state */
                <div className="px-10 py-14 text-center">
                  <CheckCircle size={48} className="mx-auto mb-5" style={{ color: OLIVE }} />
                  <h3 className="luxury-heading text-2xl font-bold uppercase tracking-widest mb-3" style={{ color: OLIVE }}>
                    Bienvenue dans le Club
                  </h3>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: "#5a6148" }}>
                    Vous faites maintenant partie du Club VIP Ziziwatches.
                  </p>
                  <p className="text-xs" style={{ color: "#8a9070" }}>
                    Vous recevrez bientôt vos offres exclusives.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 px-8 py-3 text-white text-xs tracking-[0.3em] uppercase font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: OLIVE }}
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                /* Form */
                <div className="px-8 md:px-10 py-10">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <Crown size={24} style={{ color: GOLD }} />
                    <h3 className="luxury-heading text-2xl font-bold uppercase tracking-widest" style={{ color: OLIVE }}>
                      Club VIP
                    </h3>
                  </div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#8a9070" }}>
                    Accès exclusif — 100% gratuit
                  </p>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 mb-8 mt-4">
                    {["Offres en avant-première", "Promotions réservées", "Cadeaux surprise"].map((b) => (
                      <span key={b} className="text-[11px] flex items-center gap-1.5" style={{ color: "#5a6148" }}>
                        <span style={{ color: GOLD }}>✦</span> {b}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                        Prénom
                      </label>
                      <input required value={name} onChange={e => setName(e.target.value)} placeholder="Votre prénom" className={FIELD} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                        Ville
                      </label>
                      <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Votre ville" className={FIELD} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                        Téléphone ou Email
                      </label>
                      <input required value={contact} onChange={e => setContact(e.target.value)} placeholder="0612345678 ou exemple@email.com" className={FIELD} />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 text-white text-sm tracking-[0.3em] uppercase font-bold transition-opacity hover:opacity-80 disabled:opacity-50 mt-2"
                      style={{ backgroundColor: OLIVE }}
                    >
                      {loading ? "Inscription..." : "✦  Rejoindre le Club  ✦"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
