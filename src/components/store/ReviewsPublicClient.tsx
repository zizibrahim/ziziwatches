"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import MarqueeSection from "@/components/home/MarqueeSection";
import CategoryCircles from "@/components/home/CategoryCircles";
import ReviewsSection from "@/components/home/ReviewsSection";
import SocialProofGallery from "@/components/store/SocialProofGallery";
import BrandManifesto from "@/components/home/BrandManifesto";
import LeaveReviewSection from "@/components/store/LeaveReviewSection";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  approvedAt: string;
  product: { nameFr: string } | null;
};

type SocialProofImage = {
  id: string;
  url: string;
  platform: string;
  caption: string | null;
};

export default function ReviewsPublicClient({
  reviews,
  socialProof,
}: {
  reviews: Review[];
  socialProof: SocialProofImage[];
}) {
  return (
    <main className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center text-center overflow-hidden" style={{ minHeight: 480 }}>
        {/* Background image */}
        <Image
          src="/pic4.png"
          alt="Reviews hero"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          quality={85}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(15, 18, 10, 0.62)" }} />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center px-6 py-32"
        >
          {/* Top label */}
          <p
            className="text-[10px] tracking-[0.55em] uppercase mb-8"
            style={{ color: "rgba(201,168,76,0.75)", fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Ziziwatches
          </p>

          {/* Main title */}
          <h1
            className="luxury-heading text-center mb-6"
            style={{
              fontSize: "clamp(38px, 6vw, 78px)",
              fontWeight: 300,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.96)",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            Nos Avis Clients
          </h1>

          {/* Gold divider */}
          <div className="flex items-center gap-5 mb-6">
            <div style={{ width: 48, height: 1, background: "rgba(201,168,76,0.5)" }} />
            <svg width="10" height="10" viewBox="0 0 10 10">
              <rect x="2" y="2" width="6" height="6" fill="none" stroke="rgba(201,168,76,0.7)" strokeWidth="1" transform="rotate(45 5 5)" />
            </svg>
            <div style={{ width: 48, height: 1, background: "rgba(201,168,76,0.5)" }} />
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontSize: "clamp(14px, 1.5vw, 18px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "rgba(255,255,255,0.50)",
              letterSpacing: "0.12em",
            }}
          >
            Ce que disent nos clients
          </p>
        </motion.div>
      </section>

      {/* ── MARQUEE BAR ── */}
      <MarqueeSection />

      {/* ── CATEGORY CIRCLES ── */}
      <CategoryCircles />

      {/* ── REVIEWS CAROUSEL ── */}
      <ReviewsSection reviews={reviews} />

      {/* ── SOCIAL PROOF GALLERY ── */}
      <SocialProofGallery images={socialProof} />

      {/* ── BRAND MANIFESTO ── */}
      <BrandManifesto />

      {/* ── LEAVE A REVIEW ── */}
      <LeaveReviewSection />

    </main>
  );
}
