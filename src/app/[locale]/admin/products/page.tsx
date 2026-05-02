import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import AddProductModal from "@/components/admin/AddProductModal";
import ProductActions from "@/components/admin/ProductActions";
import EditProductModal from "@/components/admin/EditProductModal";

export const dynamic = "force-dynamic";

const TAG_LABELS: Record<string, string> = {
  homme: "Homme",
  femme: "Femme",
  couple: "Couple",
};

const TAG_COLORS: Record<string, string> = {
  homme: "text-blue-400 bg-blue-400/10",
  femme: "text-pink-400 bg-pink-400/10",
  couple: "text-purple-400 bg-purple-400/10",
};

export default async function AdminProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { category?: string };
}) {
  const categoryFilter = searchParams?.category;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: { not: "ARCHIVED" },
        ...(categoryFilter ? { categoryId: categoryFilter } : {}),
      },
      include: {
        images: { orderBy: { position: "asc" } },
        category: true,
        variants: { orderBy: { position: "asc" }, include: { images: { orderBy: { position: "asc" } } } },
        attributes: true,
        tags: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { nameFr: "asc" } }),
  ]);

  const STATUS_COLOR: Record<string, string> = {
    ACTIVE: "text-green-400 bg-green-400/10",
    DRAFT: "text-yellow-400 bg-yellow-400/10",
    ARCHIVED: "text-foreground/30 bg-foreground/5",
  };

  const basePath = `/${params.locale}/admin/products`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">Administration</p>
          <h1 className="luxury-heading text-3xl font-light text-foreground">Produits</h1>
          <p className="text-foreground/40 text-sm mt-1">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <AddProductModal />
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        <Link
          href={basePath}
          className={`shrink-0 px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
            !categoryFilter
              ? "bg-olive text-white border-olive"
              : "border-border text-foreground/50 hover:text-foreground hover:border-foreground/30"
          }`}
        >
          Tous
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`${basePath}?category=${cat.id}`}
            className={`shrink-0 px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
              categoryFilter === cat.id
                ? "bg-olive text-white border-olive"
                : "border-border text-foreground/50 hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat.nameFr}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {products.length === 0 && (
          <div className="text-center py-16 border border-border/40 text-foreground/30 text-sm">
            Aucun produit dans cette catégorie.
          </div>
        )}
        {products.map((product) => {
          const img = product.images[0]?.url;
          const genderTags = product.tags.filter((t) => ["homme", "femme", "couple"].includes(t.tag));

          return (
            <div key={product.id} className="bg-surface border border-border p-3 sm:p-4">
              {/* Top row: thumbnail + info + price */}
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-background border border-border shrink-0 overflow-hidden">
                  {img ? (
                    <Image src={img} alt={product.nameFr} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/20 text-xs">?</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <p className="text-foreground text-sm font-medium truncate">{product.nameFr}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLOR[product.status]}`}>
                      {product.status}
                    </span>
                    {product.featured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-gold bg-gold/10 shrink-0">★</span>
                    )}
                    {genderTags.map((t) => (
                      <span key={t.id} className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${TAG_COLORS[t.tag] ?? "text-foreground/40 bg-foreground/5"}`}>
                        {TAG_LABELS[t.tag] ?? t.tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-foreground/40 text-xs font-mono truncate">
                    {product.sku}{product.category ? ` · ${product.category.nameFr}` : ""}
                  </p>
                </div>

                {/* Price & stock */}
                <div className="text-right shrink-0">
                  <p className="text-gold font-medium text-sm">{formatPrice(product.price)}</p>
                  <p className="text-foreground/40 text-xs mt-0.5">Stock: {product.stock}</p>
                </div>
              </div>

              {/* Bottom row: actions */}
              <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/50">
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
                    categorySlug: product.category?.slug ?? null,
                    status: product.status,
                    featured: product.featured,
                    isNew: product.isNew,
                    images: product.images.map((img) => ({ url: img.url, altFr: img.altFr ?? undefined })),
                    variants: product.variants.map((v) => ({
                      id: v.id,
                      colorName: v.colorName,
                      colorHex: v.colorHex ?? "",
                      stock: v.stock,
                      images: v.images.map((img) => ({ url: img.url })),
                    })),
                    attributes: product.attributes.map((a) => ({
                      keyFr: a.keyFr,
                      keyEn: a.keyEn,
                      keyAr: a.keyAr,
                      valueFr: a.valueFr,
                      valueEn: a.valueEn,
                      valueAr: a.valueAr,
                    })),
                    tags: product.tags.map((t) => t.tag),
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
