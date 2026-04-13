import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import TrustSection from "@/components/home/TrustSection";

export const metadata: Metadata = {
  title: "Ziziwatches — L'Art du Temps",
  description:
    "Montres de luxe, accessoires et cadeaux. Livraison partout au Maroc.",
  openGraph: {
    title: "Ziziwatches — L'Art du Temps",
    description: "Montres de luxe pour ceux qui savent que chaque seconde compte.",
    type: "website",
  },
};

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: { select: { nameFr: true, nameEn: true, nameAr: true } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main>
        {/* 1 — Hero: 88vh so categories peek below the fold */}
        <HeroSection />
        <MarqueeSection />

        {/* 2 — Category bento grid: main navigation of the store */}
        <CategoryShowcase />

        {/* 3 — Featured products (only shown when products exist) */}
        {featuredProducts.length > 0 && (
          <FeaturedProducts products={featuredProducts} />
        )}

        {/* 4 — Trust signals */}
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
