import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import CategoryCircles from "@/components/home/CategoryCircles";
import BestsellersSection from "@/components/home/BestsellersSection";
import BrandManifesto from "@/components/home/BrandManifesto";
import ReviewsSection from "@/components/home/ReviewsSection";
import StandsForSection from "@/components/home/StandsForSection";
import VipBannerSection from "@/components/home/VipBannerSection";

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
  const approvedReviews = await prisma.review.findMany({
    where: { status: "APPROVED", rating: { not: null } },
    include: { product: { select: { nameFr: true } } },
    orderBy: { approvedAt: "desc" },
    take: 20,
  });

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MarqueeSection />
        <CategoryCircles />
        <BestsellersSection />
        <BrandManifesto />
        <ReviewsSection reviews={approvedReviews as any} />
        <StandsForSection />
        <VipBannerSection />
      </main>
      <Footer />
    </>
  );
}
