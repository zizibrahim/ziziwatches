import ProductCard from "./ProductCard";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  compareAtPrice: number | null;
  isNew: boolean;
  stock: number;
  sku: string;
  images: { url: string; altFr: string | null }[];
  category?: { nameFr: string; nameEn: string; nameAr: string } | null;
}

/**
 * Splits products into N flex columns with vertical stagger offsets.
 * Creates an editorial masonry look unlike any standard product grid.
 *
 * Desktop (3 col): col 0 = baseline, col 1 = 80px down, col 2 = 40px down
 * Mobile  (2 col): col 0 = baseline, col 1 = 40px down
 */
export default function ProductMasonryGrid({ products }: { products: Product[] }) {
  // Split into columns: product at index i goes to column i % N
  const col2 = [0, 1].map((ci) => products.filter((_, i) => i % 2 === ci));
  const col3 = [0, 1, 2].map((ci) => products.filter((_, i) => i % 3 === ci));

  const desktopOffsets = [0, 80, 40];   // px top margin per column
  const mobileOffsets  = [0, 44];

  return (
    <>
      {/* ── Mobile: 2 staggered columns ── */}
      <div className="flex gap-4 items-start lg:hidden">
        {col2.map((col, ci) => (
          <div
            key={ci}
            className="flex-1 flex flex-col gap-8"
            style={{ marginTop: mobileOffsets[ci] + "px" }}
          >
            {col.map((product, pi) => (
              <ProductCard
                key={product.id}
                product={product}
                position={ci + pi * 2 + 1}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Desktop: 3 staggered columns ── */}
      <div className="hidden lg:flex gap-10 items-start">
        {col3.map((col, ci) => (
          <div
            key={ci}
            className="flex-1 flex flex-col gap-14"
            style={{ marginTop: desktopOffsets[ci] + "px" }}
          >
            {col.map((product, pi) => (
              <ProductCard
                key={product.id}
                product={product}
                position={ci + pi * 3 + 1}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
