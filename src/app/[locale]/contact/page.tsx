import { prisma } from "@/lib/prisma";
import ContactClient from "@/components/contact/ContactClient";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale as "fr" | "en" | "ar";

  let localizedFaqs: { id: string; question: string; answer: string }[] = [];

  try {
    const faqs = await prisma.$queryRaw<any[]>`
      SELECT * FROM faqs WHERE published = 1 ORDER BY "order" ASC
    `;

    localizedFaqs = faqs.map((f: any) => ({
      id: f.id,
      question:
        locale === "en" ? f.questionEn : locale === "ar" ? f.questionAr : f.questionFr,
      answer:
        locale === "en" ? f.answerEn : locale === "ar" ? f.answerAr : f.answerFr,
    }));
  } catch {
    // faq table not yet available — show page without FAQs
  }

  return <ContactClient faqs={localizedFaqs} />;
}
