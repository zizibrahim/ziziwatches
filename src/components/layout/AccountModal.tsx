"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, User, Package, MessageCircle, Crown } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import VipModal from "./VipModal";

const OLIVE = "#3d4535";
const FIELD_CLASS =
  "w-full bg-transparent border-b-2 border-[#c8c0b0] px-0 py-3 text-base text-[#3d4535] placeholder:text-[#a09880] focus:outline-none focus:border-[#3d4535] transition-colors duration-200";

const STORE_WHATSAPP = "212717728154";

interface Props {
  open: boolean;
  onClose: () => void;
  profile?: { name: string } | null;
}

export default function AccountModal({ open, onClose, profile }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const [tab, setTab] = useState<"menu" | "track">("menu");
  const [orderNum, setOrderNum] = useState("");
  const [phone, setPhone] = useState("");
  const [trackError, setTrackError] = useState("");
  const [vipOpen, setVipOpen] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim() || !phone.trim()) {
      setTrackError("Veuillez remplir tous les champs.");
      return;
    }
    const wa = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(
      `Bonjour, je voudrais suivre ma commande ${orderNum.trim()} passée avec le numéro ${phone.trim()}.`
    )}`;
    window.open(wa, "_blank");
    onClose();
  };

  const close = () => { onClose(); setTab("menu"); setOrderNum(""); setPhone(""); setTrackError(""); };

  return (
    <>
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div
              className="relative w-full max-w-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: "#f5f0e8" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top bar */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${OLIVE}, #6b7a57, ${OLIVE})` }} />

              <button
                onClick={close}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors"
                style={{ color: OLIVE }}
              >
                <X size={16} />
              </button>

              <div className="flex flex-col md:flex-row">

                {/* Left panel */}
                <div className="hidden md:flex md:w-2/5 flex-col items-center justify-center py-12 px-8 text-center" style={{ backgroundColor: OLIVE }}>
                  <User size={48} color="#c9b97a" className="mb-5" />
                  <h4 className="luxury-heading text-xl font-bold uppercase tracking-widest text-white mb-3">
                    {profile?.name ?? "Mon Compte"}
                  </h4>
                  <p className="text-white/60 text-xs leading-relaxed tracking-wide">
                    Suivez vos commandes, contactez notre équipe ou rejoignez notre club VIP.
                  </p>
                  <div className="mt-8 space-y-2 w-full">
                    {["Suivi de commande", "Support client", "Accès VIP"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-white/70 text-xs">
                        <span style={{ color: "#c9b97a" }}>✦</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 px-8 md:px-10 py-10 md:py-12">
                  {tab === "menu" ? (
                    <>
                      <h3 className="luxury-heading text-2xl md:text-3xl font-bold uppercase mb-1" style={{ color: OLIVE }}>
                        {profile?.name ? `Bonjour, ${profile.name}` : "Bonjour"}
                      </h3>
                      <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "#8a9070" }}>
                        Que souhaitez-vous faire ?
                      </p>

                      <div className="space-y-3">
                        {/* Track order */}
                        <Link
                          href={`/${locale}/suivi`}
                          onClick={close}
                          className="w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all hover:border-[#3d4535] group"
                          style={{ borderColor: "#d4cfc7" }}
                        >
                          <Package size={20} style={{ color: OLIVE }} className="shrink-0" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: OLIVE }}>Suivre ma commande</p>
                            <p className="text-xs mt-0.5" style={{ color: "#8a9070" }}>Statut, livraison, confirmation</p>
                          </div>
                        </Link>

                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/${STORE_WHATSAPP}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={close}
                          className="w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all hover:border-[#25D366] group"
                          style={{ borderColor: "#d4cfc7" }}
                        >
                          <MessageCircle size={20} className="shrink-0 text-[#25D366]" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: OLIVE }}>Contacter via WhatsApp</p>
                            <p className="text-xs mt-0.5" style={{ color: "#8a9070" }}>Réponse rapide de notre équipe</p>
                          </div>
                        </a>

                        {/* VIP */}
                        <button
                          onClick={() => { close(); setVipOpen(true); }}
                          className="w-full flex items-center gap-4 px-5 py-4 border-2 text-left transition-all hover:border-[#c9b97a]"
                          style={{ borderColor: "#d4cfc7" }}
                        >
                          <Crown size={20} style={{ color: "#c9b97a" }} className="shrink-0" />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: OLIVE }}>Rejoindre le Club VIP</p>
                            <p className="text-xs mt-0.5" style={{ color: "#8a9070" }}>Offres exclusives — 100% gratuit</p>
                          </div>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setTab("menu")}
                        className="text-xs tracking-wider uppercase mb-6 flex items-center gap-1 transition-opacity hover:opacity-60"
                        style={{ color: "#8a9070" }}
                      >
                        ← Retour
                      </button>
                      <h3 className="luxury-heading text-2xl font-bold uppercase mb-1" style={{ color: OLIVE }}>
                        Suivre ma commande
                      </h3>
                      <p className="text-xs tracking-[0.2em] uppercase mb-8" style={{ color: "#8a9070" }}>
                        Via WhatsApp — réponse en quelques minutes
                      </p>

                      <form onSubmit={handleTrack} className="space-y-6">
                        <div>
                          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                            Numéro de commande
                          </label>
                          <input
                            required
                            value={orderNum}
                            onChange={(e) => setOrderNum(e.target.value)}
                            placeholder="ex. ZW-2026-1234"
                            className={FIELD_CLASS}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold" style={{ color: "#5a6148" }}>
                            Téléphone
                          </label>
                          <input
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="ex. 0612345678"
                            className={FIELD_CLASS}
                          />
                        </div>
                        {trackError && <p className="text-red-500 text-sm">{trackError}</p>}
                        <button
                          type="submit"
                          className="w-full py-4 rounded-full text-white text-sm tracking-[0.3em] uppercase font-bold transition-opacity hover:opacity-80 mt-2"
                          style={{ backgroundColor: OLIVE }}
                        >
                          ✦  Envoyer via WhatsApp  ✦
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <VipModal open={vipOpen} onClose={() => setVipOpen(false)} />
    </>
  );
}
