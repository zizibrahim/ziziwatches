import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FaqCategoryClient from "@/components/store/FaqCategoryClient";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = ["watches", "jewellery", "shipping", "orders", "payment", "account"];

const CATEGORY_LABELS: Record<string, { en: string; fr: string }> = {
  watches:   { en: "Watches",          fr: "Montres" },
  jewellery: { en: "Jewellery",        fr: "Bijoux" },
  shipping:  { en: "Shipping",         fr: "Livraison" },
  orders:    { en: "My Order",         fr: "Ma Commande" },
  payment:   { en: "Payment",          fr: "Paiement" },
  account:   { en: "Customer Account", fr: "Compte Client" },
};

type RawFaq = {
  id: string;
  questionFr: string;
  questionEn: string;
  questionAr: string;
  answerFr: string;
  answerEn: string;
  answerAr: string;
  category: string;
  order: number;
  published: number | boolean;
};

export default async function FaqCategoryPage({
  params,
}: {
  params: { locale: string; category: string };
}) {
  if (!VALID_CATEGORIES.includes(params.category)) notFound();

  const faqs = await prisma.$queryRaw<RawFaq[]>`
    SELECT * FROM faqs
    WHERE published = 1 AND category = ${params.category}
    ORDER BY "order" ASC
  `;

  const label = CATEGORY_LABELS[params.category];

  return (
    <>
      <Header />
      <FaqCategoryClient
        faqs={faqs}
        locale={params.locale}
        category={params.category}
        labelEn={label.en}
        labelFr={label.fr}
      />
      <Footer />
    </>
  );
}
