"use client";

import { motion } from "framer-motion";

export default function OwnerQuoteSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 480 }}>

      {/* Background image via CSS so it covers perfectly */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pic4.png')" }}
      />

      {/* Dark olive overlay for readability */}
      <div className="absolute inset-0" style={{ background: "rgba(30, 35, 20, 0.62)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-16 py-24 h-full min-h-[480px]">

        {/* Opening quote mark */}
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 96,
            color: "rgba(255,255,255,0.18)",
            lineHeight: 0.6,
            display: "block",
            marginBottom: 28,
          }}
        >
          &ldquo;
        </motion.span>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(16px, 2.2vw, 26px)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(255,255,255,0.92)",
            lineHeight: 1.85,
            maxWidth: 780,
            letterSpacing: "0.02em",
          }}
        >
          Ce projet n&apos;est pas seulement le mien… il appartient à tous ceux qui y ont cru
          et qui nous ont accordé leur confiance.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="my-8"
          style={{ width: 48, height: 1, background: "rgba(255,255,255,0.4)" }}
        />

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(11px, 1.1vw, 14px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          — Fondateur, Ziziwatches
        </motion.p>

      </div>
    </section>
  );
}
