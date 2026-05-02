import ReviewsClient from "@/components/admin/ReviewsClient";

export const dynamic = "force-dynamic";

export default function ReviewsPage({ params }: { params: { locale: string } }) {
  return <ReviewsClient locale={params.locale} />;
}
