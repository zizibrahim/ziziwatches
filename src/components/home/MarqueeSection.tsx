"use client";

const items = [
  "Qualité Premium",
  "◆",
  "Livraison Gratuite",
  "◆",
  "Nouveautés 2026",
  "◆",
  "Paiement à la Livraison",
  "◆",
  "Collections Exclusives",
  "◆",
  "Service Client",
  "◆",
];

const repeated = [...items, ...items];

export default function MarqueeSection() {
  return (
    <div className="overflow-hidden border-y border-gold/10 bg-[#4a5240] py-3.5 select-none">
      <div className="flex animate-marquee whitespace-nowrap gap-8">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={
              item === "◆"
                ? "text-gold/40 text-[8px] flex-shrink-0 leading-none"
                : "text-white/20 text-[10px] tracking-[0.4em] uppercase flex-shrink-0 font-light"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
