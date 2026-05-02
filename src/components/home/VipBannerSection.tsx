"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Crown, MapPin, Phone } from "lucide-react";

const FIELD_CLASS =
  "w-full bg-white/80 border-b-2 border-[#c8c0b0] px-0 py-3 text-base text-[#3d4535] placeholder:text-[#a09880] focus:outline-none focus:border-[#3d4535] transition-colors duration-200 bg-transparent";

export default function VipBannerSection() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", contact: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/vip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", city: "", contact: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <section className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[500px]">
            <Image src="/pic3.png" alt="Ziziwatches" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="w-full md:w-1/2 flex items-center px-10 md:px-16 lg:px-20 py-16 md:py-0" style={{ backgroundColor: "#f0ebe2" }}>
            <div>
              <h2 className="luxury-heading text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1.05] mb-6 whitespace-nowrap" style={{ color: "#3d4535" }}>
                Ne ratez pas ça
              </h2>
              <p className="luxury-heading text-xl md:text-2xl leading-relaxed mb-8 max-w-lg font-light" style={{ color: "#5a6148" }}>
                Vous ne voulez pas manquer nos promotions exclusives ? Rejoignez notre club VIP maintenant —{" "}
                <span className="font-semibold">100% gratuit !</span>
              </p>
              <button
                onClick={() => { setOpen(true); setStatus("idle"); }}
                className="luxury-heading inline-flex items-center gap-2 px-8 py-3 rounded-full text-white text-sm tracking-[0.25em] uppercase font-bold transition-opacity duration-300 hover:opacity-80"
                style={{ backgroundColor: "#3d4535" }}
              >
                <Crown size={15} />
                Devenir VIP
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center overflow-visible" style={{ backgroundColor: "#4a5240", height: "56px" }}>
          <Image src="/logo.png" alt="Ziziwatches" width={700} height={110} className="object-contain brightness-0 invert" style={{ height: "110px", width: "auto" }} />
        </div>
      </section>

      {/* ── VIP Modal ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div
                className="relative w-full max-w-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "#f5f0e8" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top decorative band */}
                <div className="h-2 w-full" style={{ background: "linear-gradient(90deg, #3d4535, #6b7a57, #3d4535)" }} />

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                  style={{ color: "#3d4535" }}
                >
                  <X size={16} />
                </button>

                {status === "success" ? (
                  <div className="flex flex-col items-center text-center px-12 py-16">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#3d4535" }}>
                      <Crown size={36} color="white" />
                    </div>
                    <h3 className="luxury-heading text-3xl font-bold uppercase mb-3" style={{ color: "#3d4535" }}>
                      Bienvenue !
                    </h3>
                    <p className="text-base leading-relaxed max-w-sm" style={{ color: "#5a6148" }}>
                      Vous êtes maintenant membre de notre club VIP exclusif. Vous serez parmi les premiers à profiter de nos offres !
                    </p>
                    <p className="mt-2 text-sm tracking-[0.5em]" style={{ color: "#8a9070" }}>✦ ✦ ✦</p>
                    <button
                      onClick={() => setOpen(false)}
                      className="mt-8 px-10 py-3 rounded-full text-white text-sm tracking-[0.25em] uppercase font-bold hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: "#3d4535" }}
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row">
                    {/* Left decorative panel */}
                    <div className="hidden md:flex md:w-2/5 flex-col items-center justify-center py-12 px-8 text-center" style={{ backgroundColor: "#3d4535" }}>
                      <Crown size={48} color="#c9b97a" className="mb-5" />
                      <h4 className="luxury-heading text-xl font-bold uppercase tracking-widest text-white mb-3">
                        Club VIP
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed tracking-wide">
                        Accès prioritaire aux nouvelles collections, promotions exclusives et offres réservées.
                      </p>
                      <div className="mt-8 space-y-2 w-full">
                        {["Offres exclusives", "Nouveautés en avant-première", "100% gratuit"].map((perk) => (
                          <div key={perk} className="flex items-center gap-2 text-white/70 text-xs">
                            <span className="text-[#c9b97a]">✦</span>
                            {perk}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right form */}
                    <div className="flex-1 px-8 md:px-10 py-10 md:py-12">
                      <h3 className="luxury-heading text-2xl md:text-3xl font-bold uppercase mb-1" style={{ color: "#3d4535" }}>
                        Rejoindre le club
                      </h3>
                      <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "#8a9070" }}>
                        Inscription gratuite — moins de 30 secondes
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="relative">
                          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                            Nom complet
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={FIELD_CLASS}
                            placeholder="Votre prénom et nom"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                            <MapPin size={10} className="inline mr-1" />
                            Ville
                          </label>
                          <input
                            type="text"
                            required
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className={FIELD_CLASS}
                            placeholder="Votre ville"
                          />
                        </div>

                        <div className="relative">
                          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                            <Phone size={10} className="inline mr-1" />
                            Téléphone ou Email
                          </label>
                          <input
                            type="text"
                            required
                            value={form.contact}
                            onChange={(e) => setForm({ ...form, contact: e.target.value })}
                            className={FIELD_CLASS}
                            placeholder="+213 6XX XXX XXX  ou  email@example.com"
                          />
                        </div>

                        {status === "error" && (
                          <p className="text-red-500 text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                        )}

                        <button
                          type="submit"
                          disabled={status === "loading"}
                          className="w-full py-4 rounded-full text-white text-sm tracking-[0.3em] uppercase font-bold transition-opacity hover:opacity-80 disabled:opacity-50 mt-2"
                          style={{ backgroundColor: "#3d4535" }}
                        >
                          {status === "loading" ? "Envoi en cours…" : "✦  Devenir VIP  ✦"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
