import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminProductsPage({ params }: { params: { locale: string } }) {
  const products = await prisma.product.findMany({
    where: { status: { not: "ARCHIVED" } },
    include: {
      images: { take: 1, orderBy: { position: "asc" } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Produits</h1>
          <p className="text-foreground/40 text-sm mt-1">{products.length} produit(s)</p>
        </div>
        <Link
          href={`/${params.locale}/admin/products/new`}
          className="btn-gold flex items-center gap-2"
        >
          <Plus size={14} />
          Nouveau produit
        </Link>
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Produit", "Catégorie", "Prix", "Stock", "Statut"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] text-foreground/30 uppercase tracking-widest font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-border/50 hover:bg-background/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-background overflow-hidden shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.nameFr}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-foreground/80 text-sm">{product.nameFr}</p>
                      <p className="text-foreground/30 text-xs font-mono">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/50 text-xs">
                  {product.category.nameFr}
                </td>
                <td className="px-4 py-3 text-gold text-sm">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium ${
                      product.stock === 0
                        ? "text-red-400"
                        : product.stock <= 5
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                      product.status === "ACTIVE"
                        ? "text-green-400 bg-green-400/10"
                        : "text-foreground/30 bg-white/5"
                    }`}
                  >
                    {product.status === "ACTIVE" ? "Actif" : "Brouillon"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
