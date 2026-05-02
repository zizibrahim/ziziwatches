"use client";

import { motion } from "framer-motion";

export default function BrandManifesto() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 480 }}>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/pic4.png')" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(20, 25, 14, 0.65)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-16 py-24 min-h-[480px]">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.3)" }} />
          <span style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontSize: 10, letterSpacing: "0.5em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
            Ziziwatches
          </span>
          <div className="w-10 h-px" style={{ background: "rgba(255,255,255,0.3)" }} />
        </motion.div>

        {/* Large opening quote */}
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            fontSize: 100,
            color: "rgba(255,255,255,0.12)",
            lineHeight: 0.5,
            display: "block",
            marginBottom: 24,
          }}
        >
          &ldquo;
        </motion.span>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            fontSize: "clamp(16px, 2.4vw, 28px)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "rgba(255,255,255,0.93)",
            lineHeight: 1.85,
            maxWidth: 800,
            letterSpacing: "0.02em",
          }}
        >
          Ce projet n&apos;est pas seulement le mien… il appartient à tous ceux qui y ont cru
          et qui nous ont accordé leur confiance.
        </motion.blockquote>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="my-8 origin-center"
          style={{ width: 48, height: 1, background: "rgba(255,255,255,0.35)" }}
        />

        {/* Owner attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            fontSize: "clamp(11px, 1.1vw, 14px)",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          — Brahim Zizi, Fondateur de Ziziwatches
        </motion.p>

      </div>
    </section>
  );
}
