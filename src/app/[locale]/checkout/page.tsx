"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const OLIVE = "#4a5240";

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName:  z.string().min(2, "Minimum 2 caractères"),
  phone:     z.string().min(9, "Numéro invalide").max(15, "Numéro invalide"),
  email:     z.string().email("Email invalide").optional().or(z.literal("")),
  street:    z.string().min(5, "Adresse trop courte"),
  city:      z.string().min(2, "Ville requise"),
  notes:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full bg-background border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none transition-colors";
const inputFocus = "focus:border-olive";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const subtotal = getSubtotal();

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          wilaya: "",
          locale,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            packaging: item.packaging,
            variantColor: item.variantColor ?? null,
          })),
        }),
      });
      const result = await res.json();
      if (!res.ok) { setError("Une erreur est survenue. Réessayez."); return; }
      router.push(`/${locale}/order-success?n=${result.orderNumber}&t=${result.total}&phone=${encodeURIComponent(data.phone)}&name=${encodeURIComponent(data.firstName)}`);
      clearCart();
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center section-padding">
          <div className="text-center">
            <p className="text-foreground/50 mb-4">Votre panier est vide.</p>
            <Link href={`/${locale}/shop`} className="inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white hover:opacity-80 transition-opacity" style={{ background: OLIVE }}>
              Boutique
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">

        {/* Breadcrumb */}
        <div className="border-b border-border/50">
          <div className="section-padding py-3 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-foreground/35 pt-20 lg:pt-24">
            <Link href={`/${locale}`} className="hover:text-foreground/60 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href={`/${locale}/cart`} className="hover:text-foreground/60 transition-colors">Panier</Link>
            <span>/</span>
            <span className="text-foreground/70">Commande</span>
          </div>
        </div>

        <div className="section-padding py-10 lg:py-16 max-w-6xl mx-auto">

          {/* Heading */}
          <div className="flex items-center gap-5 mb-10">
            <h1 className="luxury-heading text-3xl font-light text-foreground whitespace-nowrap">
              {t("title")}
            </h1>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 xl:gap-16 items-start">

            {/* ── Form ── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Personal info */}
              <div>
                <h2 className="text-[10px] tracking-[0.35em] uppercase mb-4 font-medium" style={{ color: OLIVE }}>
                  {t("personalInfo")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input {...register("firstName")} placeholder={t("firstName")} className={`${inputClass} ${inputFocus}`} />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <input {...register("lastName")} placeholder={t("lastName")} className={`${inputClass} ${inputFocus}`} />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <input {...register("phone")} placeholder={t("phone")} type="tel" className={`${inputClass} ${inputFocus}`} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <input {...register("email")} placeholder={`${t("email")} (optionnel)`} type="email" className={`${inputClass} ${inputFocus}`} />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-[10px] tracking-[0.35em] uppercase mb-4 font-medium" style={{ color: OLIVE }}>
                  {t("address")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <input {...register("street")} placeholder={t("street")} className={`${inputClass} ${inputFocus}`} />
                    {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>}
                  </div>
                  <div>
                    <input {...register("city")} placeholder={t("city")} className={`${inputClass} ${inputFocus}`} />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <textarea
                    {...register("notes")}
                    placeholder={t("notes")}
                    rows={3}
                    className={`${inputClass} ${inputFocus} resize-none`}
                  />
                </div>
              </div>

              {/* Payment method */}
              <div className="flex items-center gap-4 p-4 border" style={{ borderColor: `${OLIVE}30`, background: `${OLIVE}08` }}>
                <Package size={20} style={{ color: OLIVE }} className="shrink-0" />
                <div>
                  <p className="text-foreground/80 text-sm font-medium">{t("payment")}</p>
                  <p className="text-foreground/40 text-xs mt-0.5">{t("paymentDesc")}</p>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 py-4 text-xs uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: OLIVE }}
              >
                {isLoading ? t("placing") : t("placeOrder")}
                {!isLoading && <ArrowRight size={14} />}
              </button>
            </form>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="border border-border/60 p-6 bg-surface/50">
                <h2 className="text-xs tracking-[0.3em] uppercase text-foreground/50 mb-5">
                  {t("orderSummary")}
                </h2>

                <div className="space-y-3 mb-5">
                  {items.map(({ product, quantity, packaging, packagingPrice }) => {
                    const name = locale === "en" ? product.nameEn : locale === "ar" ? product.nameAr : product.nameFr;
                    const lineTotal = (product.price + packagingPrice) * quantity;
                    return (
                      <div key={`${product.id}-${packaging}`} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 shrink-0 bg-background overflow-hidden border border-border/50">
                          <Image src={product.image} alt={name} fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/70 truncate">{name}</p>
                          <p className="text-[10px] text-foreground/35 mt-0.5">×{quantity}</p>
                        </div>
                        <span className="text-xs text-foreground/70 shrink-0">{formatPrice(lineTotal)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Sous-total</span>
                    <span className="text-foreground/80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Livraison</span>
                    <span className="text-xs uppercase tracking-wider" style={{ color: OLIVE }}>Gratuite</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-border/50">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-xl font-light" style={{ color: OLIVE }}>{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="p-4 border border-border/40 space-y-2.5">
                {["Paiement à la livraison", "Livraison gratuite au Maroc", "Retours sous 7 jours"].map((text) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="6" fill={OLIVE} />
                      <polyline points="3,6 5,8.5 9,3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[11px] text-foreground/45">{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
