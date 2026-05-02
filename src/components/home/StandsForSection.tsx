"use client";

import { Truck, Headphones, Gem, SmilePlus } from "lucide-react";

const pillars = [
  { icon: Truck,      label: "LIVRAISON\nGRATUITE" },
  { icon: Headphones, label: "EXCELLENT SERVICE\nCLIENT" },
  { icon: Gem,        label: "MEILLEURE\nQUALITÉ" },
  { icon: SmilePlus,  label: "CLIENTS\nSATISFAITS" },
];

export default function StandsForSection() {
  return (
    <section className="border-t border-border bg-background py-20 md:py-24">
      <div className="section-padding max-w-6xl mx-auto">

        {/* Title */}
        <h2 className="luxury-heading text-center text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-foreground mb-16">
          Ce pour quoi <span className="text-olive">Ziziwatches</span> s&apos;engage
        </h2>

        {/* Icons row */}
        <div className="flex flex-wrap justify-center gap-16 md:gap-24 lg:gap-36">
          {pillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-6 group cursor-default"
            >
              {/* Circle — scales up on hover */}
              <div className="w-32 h-32 rounded-full border border-olive flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                <Icon size={48} className="text-olive transition-transform duration-300 ease-out group-hover:scale-110" strokeWidth={1} />
              </div>
              {/* Label */}
              <p className="text-[10px] tracking-[0.22em] uppercase font-medium text-olive/70 text-center whitespace-pre-line leading-[1.8] transition-colors duration-300 group-hover:text-olive">
                {label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
