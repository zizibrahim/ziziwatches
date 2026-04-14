import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import AddProductModal from "@/components/admin/AddProductModal";
import ProductActions from "@/components/admin/ProductActions";
import EditProductModal from "@/components/admin/EditProductModal";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: { not: "ARCHIVED" } },
      include: { images: { take: 1 }, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { nameFr: "asc" } }),
  ]);

  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "text-green-400 bg-green-400/10",
    DRAFT: "text-yellow-400 bg-yellow-400/10",
    ARCHIVED: "text-foreground/30 bg-foreground/5",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Produits</h1>
          <p className="text-foreground/40 text-sm mt-1">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <AddProductModal categories={categories} />
      </div>

      <div className="space-y-2">
        {products.map((product) => {
          const img = product.images[0]?.url;
          return (
            <div key={product.id} className="bg-surface border border-border p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-12 h-12 bg-background border border-border shrink-0 overflow-hidden">
                {img ? (
                  <Image src={img} alt={product.nameFr} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">?</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-foreground text-sm font-medium truncate">{product.nameFr}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[product.status]}`}>
                    {product.status}
                  </span>
                  {product.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-gold bg-gold/10">★ Featured</span>
                  )}
                </div>
                <p className="text-foreground/40 text-xs font-mono">{product.sku}{product.category ? ` · ${product.category.nameFr}` : ""}</p>
              </div>

              {/* Price & stock */}
              <div className="text-right shrink-0">
                <p className="text-gold font-medium text-sm">{formatPrice(product.price)}</p>
                <p className="text-foreground/40 text-xs mt-0.5">Stock: {product.stock}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <EditProductModal
                  product={{
                    id: product.id,
                    nameFr: product.nameFr,
                    nameEn: product.nameEn ?? "",
                    nameAr: product.nameAr ?? "",
                    descriptionFr: product.descriptionFr ?? "",
                    descriptionEn: product.descriptionEn ?? "",
                    descriptionAr: product.descriptionAr ?? "",
                    price: product.price,
                    compareAtPrice: product.compareAtPrice,
                    coffretPrice: product.coffretPrice,
                    stock: product.stock,
                    categoryId: product.categoryId,
                    status: product.status,
                    featured: product.featured,
                    isNew: product.isNew,
                    imageUrl: product.images[0]?.url ?? null,
                  }}
                  categories={categories}
                />
                <ProductActions productId={product.id} currentStatus={product.status} featured={product.featured} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
