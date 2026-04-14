import { prisma } from "@/lib/prisma";
import FaqClient from "@/components/admin/FaqClient";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await prisma.$queryRaw<any[]>`
    SELECT * FROM faqs ORDER BY "order" ASC
  `;
  return <FaqClient faqs={faqs} />;
}
