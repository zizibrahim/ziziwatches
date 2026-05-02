"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const OLIVE = "#4a5240";
const CREAM = "#f0ede6";

export default function VipSection() {
  return (
    <section className="w-full">

      {/* ── Main row: image left + text right ── */}
      <div className="flex flex-col sm:flex-row" style={{ minHeight: 560 }}>

        {/* Left — image */}
        <div className="relative w-full sm:w-1/2" style={{ minHeight: 380 }}>
          <Image
            src="/pic3.png"
            alt="Ziziwatches VIP"
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right — cream panel */}
        <div
          className="w-full sm:w-1/2 flex flex-col justify-center px-10 sm:px-20 py-16"
          style={{ background: CREAM }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(34px, 4.5vw, 64px)",
              fontWeight: 700,
              color: OLIVE,
              lineHeight: 1.05,
              letterSpacing: "0.01em",
              marginBottom: 28,
            }}
          >
            DON&apos;T MISS OUT
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(15px, 1.5vw, 19px)",
              color: "#5a5a4a",
              lineHeight: 1.8,
              marginBottom: 40,
              maxWidth: 420,
            }}
          >
            Don&apos;t want to miss out on exclusive promotions?<br />
            Sign up to our Premium Club now —<br />
            100% free of charge!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <Link
              href="/fr/shop"
              className="inline-block text-white tracking-[0.2em] uppercase transition-all hover:opacity-85"
              style={{
                background: OLIVE,
                borderRadius: 999,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 14,
                fontWeight: 600,
                padding: "14px 36px",
              }}
            >
              BECOME A VIP
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom olive bar with real white logo ── */}
      <div
        className="flex items-center justify-center"
        style={{ background: OLIVE, height: 56 }}
      >
        <Image
          src="/logo.png"
          alt="Ziziwatches"
          width={130}
          height={28}
          className="object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </div>

    </section>
  );
}
