"use client";

const items = [
  "Qualité Premium",
  "★",
  "Livraison Maroc",
  "★",
  "Nouveautés",
  "★",
  "Paiement à la livraison",
  "★",
  "Collections Exclusives",
  "★",
  "Service Client",
  "★",
];

// Duplicate so the loop is seamless
const repeated = [...items, ...items];

export default function MarqueeSection() {
  return (
    <div className="overflow-hidden border-y border-gold/15 bg-[#080808] py-4 select-none">
      <div className="flex animate-marquee whitespace-nowrap gap-10">
        {repeated.map((item, i) => (
          <span
            key={i}
            className={
              item === "★"
                ? "text-gold text-xs flex-shrink-0"
                : "text-white/30 text-[11px] tracking-[0.3em] uppercase flex-shrink-0 font-light"
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
