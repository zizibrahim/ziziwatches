import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "Ziziwatches — L'Art du Temps",
  description: "Montres de luxe pour ceux qui savent que chaque seconde compte. Livraison partout en Algérie.",
  openGraph: {
    title: "Ziziwatches — L'Art du Temps",
    description: "Montres de luxe pour ceux qui savent que chaque seconde compte.",
    type: "website",
  },
};
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandFeatures from "@/components/home/BrandFeatures";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <BrandFeatures />
        <FeaturedProducts products={featuredProducts} />

        {/* Brand Story */}
        <section className="section-padding py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-transparent mx-auto mb-8 opacity-50" />
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">
              Notre Marque
            </p>
            <h2 className="luxury-heading text-4xl lg:text-5xl font-light text-foreground mb-6 leading-tight">
              L&apos;Histoire Ziziwatches
            </h2>
            <p className="text-foreground/50 leading-relaxed text-sm sm:text-base">
              Née d&apos;une passion pour la précision et l&apos;élégance, Ziziwatches
              crée des montres qui transcendent le temps. Chaque pièce est une
              œuvre d&apos;art portée au poignet — conçue pour ceux qui exigent
              l&apos;excellence dans chaque détail.
            </p>
            <div className="w-px h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent mx-auto mt-8 opacity-30" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
