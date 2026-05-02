import { prisma } from "@/lib/prisma";
import FaqPublicClient from "@/components/store/FaqPublicClient";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryCircles from "@/components/home/CategoryCircles";

export const dynamic = "force-dynamic";

type RawFaq = {
  id: string;
  questionFr: string;
  questionEn: string;
  questionAr: string;
  answerFr: string;
  answerEn: string;
  answerAr: string;
  category: string;
  popular: number | boolean;
  order: number;
  published: number | boolean;
};

export default async function FaqPage({
  params,
}: {
  params: { locale: string };
}) {
  const all = await prisma.$queryRaw<RawFaq[]>`
    SELECT * FROM faqs WHERE published = 1 ORDER BY "order" ASC
  `;

  const popular = all.filter((f) => f.popular === 1 || f.popular === true);

  const shaped = all.map((f) => ({
    ...f,
    popular: f.popular === 1 || f.popular === true,
    published: f.published === 1 || f.published === true,
    category: f.category ?? "general",
  }));

  const shapedPopular = popular.map((f) => ({
    ...f,
    popular: true as const,
    published: true as const,
    category: f.category ?? "general",
  }));

  return (
    <>
      <Header />
      <FaqPublicClient
        popular={shapedPopular}
        all={shaped}
        locale={params.locale}
      />
      <CategoryCircles />
      <Footer />
    </>
  );
}
