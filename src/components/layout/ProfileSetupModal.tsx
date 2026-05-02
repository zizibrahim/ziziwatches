"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, User } from "lucide-react";

const OLIVE = "#3d4535";

interface Props {
  open: boolean;
  onSave: (profile: { name: string }) => void;
  onClose: () => void;
}

export default function ProfileSetupModal({ open, onSave, onClose }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const profile = { name: name.trim() };
    localStorage.setItem("zw_profile", JSON.stringify(profile));
    onSave(profile);
    setName("");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-md shadow-2xl overflow-hidden"
              style={{ backgroundColor: "#f5f0e8" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${OLIVE}, #6b7a57, ${OLIVE})` }} />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                style={{ color: OLIVE }}
              >
                <X size={16} />
              </button>

              <div className="px-8 py-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: OLIVE }}>
                    <User size={18} color="#c9b97a" />
                  </div>
                  <div>
                    <h3 className="luxury-heading text-xl font-bold uppercase tracking-widest" style={{ color: OLIVE }}>
                      Bienvenue
                    </h3>
                    <p className="text-xs tracking-[0.15em] uppercase" style={{ color: "#8a9070" }}>
                      Ziziwatches
                    </p>
                  </div>
                </div>

                <p className="text-sm mb-8 leading-relaxed" style={{ color: "#5a6148" }}>
                  Comment souhaitez-vous être appelé ?
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                      Votre prénom
                    </label>
                    <input
                      required
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="ex. Mohamed"
                      className="w-full bg-transparent border-b-2 px-0 py-3 text-base placeholder:text-[#a09880] focus:outline-none transition-colors duration-200"
                      style={{
                        borderColor: name ? OLIVE : "#c8c0b0",
                        color: OLIVE,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-white text-sm tracking-[0.3em] uppercase font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: OLIVE }}
                  >
                    ✦ &nbsp;Continuer
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
