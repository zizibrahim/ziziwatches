"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  price: number;
  images: { url: string }[];
}

export default function AIRecommendations({
  productId,
  locale,
  fallback,
}: {
  productId: string;
  locale: string;
  fallback: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(fallback);
  const [aiPowered, setAiPowered] = useState(false);

  useEffect(() => {
    fetch("/api/ai/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentProductId: productId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.recommendations?.length > 0) {
          setProducts(data.recommendations);
          setAiPowered(true);
        }
      })
      .catch(() => {/* silently keep fallback */});
  }, [productId]);

  if (!products.length) return null;

  const getName = (p: Product) =>
    locale === "en" ? p.nameEn : locale === "ar" ? p.nameAr : p.nameFr;

  return (
    <div className="mt-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <h2 className="luxury-heading text-2xl font-light text-foreground">
          {locale === "en" ? "You may also like" : locale === "ar" ? "قد يعجبك أيضاً" : "Vous aimerez aussi"}
        </h2>
        {aiPowered && (
          <span className="flex items-center gap-1 text-gold text-xs border border-gold/30 px-2 py-0.5">
            <Sparkles size={10} />
            IA
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/${locale}/shop/${p.slug}`} className="group block">
            <div className="relative aspect-square bg-surface overflow-hidden">
              {p.images[0] && (
                <Image
                  src={p.images[0].url}
                  alt={getName(p)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="33vw"
                />
              )}
            </div>
            <div className="pt-3">
              <p className="text-foreground/80 text-sm group-hover:text-gold transition-colors luxury-heading">
                {getName(p)}
              </p>
              <p className="text-gold text-xs mt-1">{formatPrice(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
