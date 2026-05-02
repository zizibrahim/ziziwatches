import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import Image from "next/image";
import MarqueeSection from "@/components/home/MarqueeSection";
import BrandManifesto from "@/components/home/BrandManifesto";
import CategoryCircles from "@/components/home/CategoryCircles";
import { Truck, Headphones, Gem, SmilePlus } from "lucide-react";

export const metadata: Metadata = {
  title: "Notre Histoire — Ziziwatches",
  description: "Découvrez l'histoire de Ziziwatches, née d'un rêve et grandie avec vous.",
};

const STOP_HEADING = "Enjoy your time";
const STOP_BODY = "The world is spinning faster and faster. Information overload and endless possibilities make life more than just easier. Our products are designed to remind you to take time out regularly and focus on the things that really matter with your personal piece of nature by your side.";

const mapStops = [
  { image: "/bra1.jpeg", title: "Le début" },
  { image: "/bra2.jpeg", title: "La passion" },
  { image: "/bra3.jpeg", title: "Aujourd'hui" },
];

export default async function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* ── Hero — pic4 background ── */}
        <div className="relative overflow-hidden min-h-[520px] flex items-center">
          <Image
            src="/pic4.png"
            alt="Ziziwatches histoire"
            fill
            className="object-cover object-center opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="section-padding relative z-10 text-center w-full pt-28 pb-20">
            <h1 className="luxury-heading text-5xl md:text-7xl font-light text-white mb-6">
              Notre <span className="text-olive">Histoire</span>
            </h1>
            <p className="luxury-heading text-2xl md:text-3xl font-light text-white/70 max-w-xl mx-auto leading-relaxed italic">
              Un rêve né d'une personne, qui grandit avec vous.
            </p>
          </div>
        </div>

        <MarqueeSection />

        {/* ── Journey timeline ── */}
        <div className="bg-surface/40 border-t border-border py-24">
          <div className="section-padding max-w-5xl mx-auto">

            {/* Stops */}
            {mapStops.map((stop, i) => (
              <div key={i}>
                <div className={`flex flex-col md:flex-row items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>

                  {/* Image — flush, no container */}
                  <div className="relative w-full md:w-[460px] h-[360px] md:h-[460px] flex-shrink-0">
                    <Image
                      src={stop.image}
                      fill
                      className="object-cover"
                      alt={stop.title}
                      sizes="460px"
                    />
                  </div>

                  {/* Text */}
                  <div className={`flex-1 flex flex-col justify-center px-10 md:px-16 py-12 ${i % 2 === 0 ? "md:border-l-2 border-olive/25" : "md:border-r-2 border-olive/25"}`}>
                    <div className="w-8 h-[2px] bg-olive mb-6" />
                    <h3 className="font-serif italic text-3xl lg:text-[2.4rem] text-olive leading-snug mb-5">
                      {STOP_HEADING}
                    </h3>
                    <p className="text-foreground/60 text-[15px] leading-[1.95]">{STOP_BODY}</p>
                  </div>
                </div>

                {/* Dashed connector between stops */}
                {i < mapStops.length - 1 && (
                  <div className="flex justify-center py-4">
                    <svg width="24" height="72" viewBox="0 0 24 72" fill="none">
                      <line x1="12" y1="0" x2="12" y2="24" stroke="#6b7a5e" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round" />
                      <rect x="7.5" y="30" width="9" height="9" transform="rotate(45 12 34.5)" fill="none" stroke="#6b7a5e" strokeWidth="1.5" />
                      <line x1="12" y1="48" x2="12" y2="72" stroke="#6b7a5e" strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}

          </div>
        </div>

        <BrandManifesto />

        {/* ── Engagements ── */}
        <div className="bg-surface/40 py-20 px-6">
          {/* Title */}
          <h2 className="luxury-heading text-center text-xl md:text-2xl font-light tracking-[0.25em] uppercase text-foreground mb-16">
            Ce pour quoi{" "}
            <span className="text-olive">Ziziwatches</span>{" "}
            s&apos;engage
          </h2>

          {/* Icons grid */}
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: Truck,      label: "Livraison\nGratuite" },
              { icon: Headphones, label: "Excellent Service\nClient" },
              { icon: Gem,        label: "Meilleure\nQualité" },
              { icon: SmilePlus,  label: "Clients\nSatisfaits" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="group flex flex-col items-center gap-5 cursor-default">
                <div className="w-28 h-28 rounded-full border-2 border-olive/50 flex items-center justify-center transition-all duration-400 group-hover:border-olive group-hover:bg-olive/10 group-hover:scale-110 group-hover:shadow-[0_0_24px_4px_rgba(107,122,94,0.18)]">
                  <Icon size={34} strokeWidth={2.2} className="text-olive transition-transform duration-400 group-hover:scale-110" />
                </div>
                <p className="text-center text-[10px] tracking-[0.3em] uppercase leading-relaxed font-bold font-serif italic text-foreground/70 transition-colors duration-300 group-hover:text-olive">
                  {label.split("\n").map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <CategoryCircles />

      </main>
      <Footer />
    </>
  );
}
