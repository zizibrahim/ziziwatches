import { prisma } from "@/lib/prisma";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { nameFr: "asc" } });
  return <CategoriesClient categories={categories} />;
}
