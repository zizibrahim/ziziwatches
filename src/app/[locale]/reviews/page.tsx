import { prisma } from "@/lib/prisma";
import ReviewsPublicClient from "@/components/store/ReviewsPublicClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, socialProof] = await Promise.all([
    prisma.review.findMany({
      where: { status: "APPROVED", rating: { not: null } },
      include: { product: { select: { nameFr: true } } },
      orderBy: { approvedAt: "desc" },
    }),
    prisma.socialProofImage.findMany({ orderBy: { position: "asc" } }),
  ]);

  const shaped = reviews.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    rating: r.rating!,
    comment: r.comment,
    approvedAt: r.approvedAt!.toISOString(),
    product: r.product ? { nameFr: r.product.nameFr } : null,
  }));

  const shapedSocial = socialProof.map((s) => ({
    id: s.id,
    url: s.url,
    platform: s.platform,
    caption: s.caption,
  }));

  return (
    <>
      <Header />
      <ReviewsPublicClient reviews={shaped} socialProof={shapedSocial} />
      <Footer />
    </>
  );
}
