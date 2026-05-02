"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const pathname = usePathname();
  const prevRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip very first render (initial load)
    if (prevRef.current === null) {
      prevRef.current = pathname;
      return;
    }
    // Only trigger on actual navigation
    if (prevRef.current === pathname) return;
    prevRef.current = pathname;

    // Show indicator
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 900);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/[0.06] rounded-full blur-[120px]" />
          </div>

          {/* Watch */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            <MiniWatch />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="luxury-heading text-[1.25rem] font-light text-white tracking-[0.25em] uppercase">
              Ziziwatches
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="w-6 h-px bg-gold/40" />
              <p className="text-gold text-[8px] tracking-[0.5em] uppercase font-medium">
                L&apos;Art du Temps
              </p>
              <div className="w-6 h-px bg-gold/40" />
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-px bg-gold/50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.85, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MiniWatch() {
  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 3;

  const [secAngle, setSecAngle] = useState(() => new Date().getSeconds() * 6);

  useEffect(() => {
    const iv = setInterval(() => setSecAngle((a) => a + 6), 150);
    return () => clearInterval(iv);
  }, []);

  const now = new Date();
  const minAngle = now.getMinutes() * 6 + now.getSeconds() * 0.1;
  const hourAngle = (now.getHours() % 12) * 30 + now.getMinutes() * 0.5;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="mfg" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#181818" />
          <stop offset="100%" stopColor="#050505" />
        </radialGradient>
      </defs>

      {/* Case */}
      <circle cx={cx} cy={cy} r={r} fill="url(#mfg)" stroke="#c9a84c" strokeWidth="1.2" />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={r - 3} fill="none" stroke="#c9a84c" strokeWidth="0.3" opacity="0.3" />

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => {
        const ang = (i * 30 - 90) * (Math.PI / 180);
        const major = i % 3 === 0;
        const ir = major ? r - 7 : r - 6;
        return (
          <line key={i}
            x1={cx + Math.cos(ang) * ir} y1={cy + Math.sin(ang) * ir}
            x2={cx + Math.cos(ang) * (r - 4)} y2={cy + Math.sin(ang) * (r - 4)}
            stroke="#c9a84c" strokeWidth={major ? 1.2 : 0.5}
            opacity={major ? 0.9 : 0.35}
          />
        );
      })}

      {/* Hour hand */}
      <Hand cx={cx} cy={cy} angle={hourAngle} length={r * 0.42} width={2} color="#d4c5a4" />
      {/* Minute hand */}
      <Hand cx={cx} cy={cy} angle={minAngle} length={r * 0.58} width={1.4} color="#d4c5a4" />
      {/* Second hand */}
      <Hand cx={cx} cy={cy} angle={secAngle} length={r * 0.66} width={0.7} color="#c9a84c" tail={r * 0.18} />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2} fill="#c9a84c" />
      <circle cx={cx} cy={cy} r={1} fill="#050505" />
    </svg>
  );
}

function Hand({ cx, cy, angle, length, width, color, tail = 0 }: {
  cx: number; cy: number; angle: number; length: number;
  width: number; color: string; tail?: number;
}) {
  const rad = (angle - 90) * (Math.PI / 180);
  const x2 = cx + Math.cos(rad) * length;
  const y2 = cy + Math.sin(rad) * length;
  const xt = tail > 0 ? cx - Math.cos(rad) * tail : cx;
  const yt = tail > 0 ? cy - Math.sin(rad) * tail : cy;
  return (
    <line x1={xt} y1={yt} x2={x2} y2={y2}
      stroke={color} strokeWidth={width} strokeLinecap="round" />
  );
}
