"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

// ─── Carousel items ────────────────────────────────────────
const ITEMS = [
  {
    slug: "montres-homme",
    label: "Montres Homme",
    sub: "Collection masculine",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=600&q=80",
  },
  {
    slug: "montres-femme",
    label: "Montres Femme",
    sub: "Élégance au poignet",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80",
  },
  {
    slug: "accessoires",
    label: "Accessoires",
    sub: "Bracelets & boîtes",
    image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600&q=80",
  },
  {
    slug: "cadeaux",
    label: "Cadeaux",
    sub: "Idées cadeaux",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&q=80",
  },
  {
    slug: "packs",
    label: "Packs",
    sub: "Offres groupées",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
  },
];

const N = ITEMS.length;
const CARD_W = 190;
const CARD_H = 255;
const RADIUS = 210;

// ─── Letter-stagger heading ────────────────────────────────
const sentence = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.5 } },
};
const letterVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedWord({ text, className = "" }: { text: string; className?: string }) {
  return (
    <motion.span
      variants={sentence}
      initial="hidden"
      animate="visible"
      className={`block overflow-hidden ${className}`}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariant} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── Magnetic button ───────────────────────────────────────
function MagneticButton({
  children,
  href,
  primary = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (dist < 90) {
      x.set((e.clientX - (r.left + r.width / 2)) * 0.45);
      y.set((e.clientY - (r.top + r.height / 2)) * 0.45);
    }
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }} className="inline-block">
      <Link
        href={href}
        className={
          primary
            ? "group inline-flex items-center gap-3 bg-gold text-black text-xs font-bold tracking-[0.22em] uppercase px-8 py-4 hover:bg-white transition-colors duration-300"
            : "inline-flex items-center gap-3 border border-white/25 text-white/60 text-xs font-medium tracking-[0.22em] uppercase px-8 py-4 hover:border-gold hover:text-gold transition-colors duration-300"
        }
      >
        {children}
        {primary && <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />}
      </Link>
    </motion.div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────
export default function HeroSection() {
  const locale = useLocale();
  const heroRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  // Spotlight
  const spotX = useMotionValue(-9999);
  const spotY = useMotionValue(-9999);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${spotX}px ${spotY}px, rgba(201,168,76,0.10) 0%, transparent 70%)`;

  // Parallax
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const textX = useSpring(useTransform(normX, [-0.5, 0.5], [12, -12]), { stiffness: 70, damping: 28 });
  const textY = useSpring(useTransform(normY, [-0.5, 0.5], [8, -8]),  { stiffness: 70, damping: 28 });

  // Carousel state
  const rotMV        = useMotionValue(0);
  const rotSpring    = useSpring(rotMV, { stiffness: 55, damping: 18, mass: 0.9 });
  const isDragging   = useRef(false);
  const lastX        = useRef(0);
  const velocity     = useRef(0);
  const dragDistance = useRef(0);
  const autoRotate   = useRef(true);
  const autoTimeout  = useRef<ReturnType<typeof setTimeout>>();

  // ── Canvas particle system ──────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r:  Math.random() * 1.3 + 0.4,
      a:  Math.random() * 0.3 + 0.07,
    }));

    let mx = -9999, my = -9999;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("mousemove", onMove);

    let id: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { p.vx += (dx / d) * 0.5; p.vy += (dy / d) * 0.5; }
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2.2) { p.vx *= 0.88; p.vy *= 0.88; }
        p.vx *= 0.993; p.vy *= 0.993;
        p.vx += (Math.random() - 0.5) * 0.012;
        p.vy += (Math.random() - 0.5) * 0.012;
        p.x = ((p.x + p.vx) + canvas.width)  % canvas.width;
        p.y = ((p.y + p.vy) + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.a})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 85) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.055 * (1 - d / 85)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      id = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Carousel animation loop (no re-renders) ─────────────
  useAnimationFrame((_, delta) => {
    if (autoRotate.current) rotMV.set(rotMV.get() - delta * 0.016);

    const rot = rotSpring.get();
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const angle = (i / N) * Math.PI * 2 + (rot * Math.PI) / 180;
      const x     = Math.sin(angle) * RADIUS;
      const z     = Math.cos(angle) * RADIUS;
      const depth = (z + RADIUS) / (RADIUS * 2);          // 0 → 1
      const scale = 0.48 + depth * 0.65;                  // 0.48 → 1.13
      card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      card.style.opacity   = String(0.15 + depth * 0.85);
      card.style.zIndex    = String(Math.round(depth * 100));
    });
  });

  // ── Hero mouse move ─────────────────────────────────────
  const onHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    spotX.set(e.clientX);
    spotY.set(e.clientY);
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    normX.set((e.clientX - r.left) / r.width  - 0.5);
    normY.set((e.clientY - r.top)  / r.height - 0.5);
  };

  // ── Drag handlers ───────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current   = true;
    lastX.current        = e.clientX;
    velocity.current     = 0;
    dragDistance.current = 0;
    autoRotate.current   = false;
    clearTimeout(autoTimeout.current);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastX.current;
    velocity.current      = dx;
    lastX.current         = e.clientX;
    dragDistance.current += Math.abs(dx);
    rotMV.set(rotMV.get() - dx * 0.35);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Snap to nearest card with momentum
    const snapStep    = 360 / N;
    const withMoment  = rotMV.get() - velocity.current * 2.5;
    const snapped     = Math.round(withMoment / snapStep) * snapStep;
    rotMV.set(snapped);
    autoTimeout.current = setTimeout(() => { autoRotate.current = true; }, 3000);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={onHeroMouseMove}
      className="relative min-h-[100svh] lg:h-[75vh] lg:min-h-[560px] bg-[#060606] overflow-hidden flex items-center"
    >
      {/* Layer 1 — canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Layer 2 — aurora spotlight */}
      <motion.div className="absolute inset-0 pointer-events-none z-10" style={{ background: spotlight }} />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.022]"
        style={{
          backgroundImage: "linear-gradient(#c9a84c 1px,transparent 1px),linear-gradient(90deg,#c9a84c 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full pt-24 pb-16 lg:py-20">

          {/* LEFT — text */}
          <motion.div style={{ x: textX, y: textY }} className="space-y-8">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gold text-xs tracking-[0.5em] uppercase flex items-center gap-3"
            >
              <span className="w-8 h-px bg-gold inline-block" />
              L'Art du Temps
            </motion.p>

            <h1 className="luxury-heading text-[clamp(3rem,6.5vw,6rem)] font-light text-white leading-[1.04] tracking-wide">
              <AnimatedWord text="Portez" />
              <AnimatedWord text="l'Excellence" className="text-gold" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-white/35 text-sm sm:text-base leading-relaxed max-w-sm"
            >
              Une sélection rigoureuse de produits d'exception — conçue pour
              ceux qui exigent l'excellence dans chaque détail.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="flex flex-wrap gap-5"
            >
              <MagneticButton href={`/${locale}/shop`} primary>Découvrir</MagneticButton>
              <MagneticButton href={`/${locale}/shop`}>Catégories</MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex gap-6 sm:gap-10 pt-6 border-t border-white/[0.07]"
            >
              {[
                ["24h–48h", "Livraison"],
                ["Partout", "Au Maroc"],
                ["Cash", "À la livraison"],
              ].map(([val, label]) => (
                <div key={label}>
                  <p className="text-gold luxury-heading text-2xl font-light">{val}</p>
                  <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT — 3D draggable carousel (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="hidden lg:relative lg:flex flex-col items-center justify-center gap-6 lg:gap-8"
          >
            {/* Ambient glow behind carousel */}
            <div className="absolute pointer-events-none">
              <div className="w-80 h-80 bg-gold/[0.07] rounded-full blur-[90px]" />
            </div>

            {/* Perspective wrapper */}
            <div style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
              {/* Draggable stage */}
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                className="select-none"
                style={{
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  transformStyle: "preserve-3d",
                  position: "relative",
                  cursor: "grab",
                }}
              >
                {ITEMS.map((item, i) => (
                  <div
                    key={item.slug}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: `${CARD_W}px`,
                      height: `${CARD_H}px`,
                      willChange: "transform, opacity",
                    }}
                  >
                    <Link
                      href={`/${locale}/shop?category=${item.slug}`}
                      onClick={(e) => { if (dragDistance.current > 8) e.preventDefault(); }}
                      draggable={false}
                      className="block w-full h-full overflow-hidden border border-white/10 hover:border-gold/40 transition-colors duration-300"
                    >
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        className="object-cover pointer-events-none select-none"
                        sizes="190px"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 pb-4">
                        <p className="text-gold text-[9px] tracking-[0.3em] uppercase mb-0.5">{item.sub}</p>
                        <p className="text-white text-sm font-light luxury-heading">{item.label}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Drag hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="text-white/20 text-[9px] tracking-[0.4em] uppercase"
            >
              ← Faites glisser →
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-20 pointer-events-none"
      >
        <span className="text-[9px] tracking-[0.45em] uppercase">Défiler</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ArrowDown size={12} />
        </motion.div>
      </motion.div>
    </section>
  );
}
