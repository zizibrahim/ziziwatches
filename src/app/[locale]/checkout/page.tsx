"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const WILAYAS = [
  "Tanger-Tétouan-Al Hoceïma",
  "L'Oriental",
  "Fès-Meknès",
  "Rabat-Salé-Kénitra",
  "Béni Mellal-Khénifra",
  "Casablanca-Settat",
  "Marrakech-Safi",
  "Drâa-Tafilalet",
  "Souss-Massa",
  "Guelmim-Oued Noun",
  "Laâyoune-Sakia El Hamra",
  "Dakhla-Oued Ed-Dahab",
];

const schema = z.object({
  firstName: z.string().min(2, "Minimum 2 caractères"),
  lastName: z.string().min(2, "Minimum 2 caractères"),
  phone: z.string().min(9, "Numéro invalide").max(15, "Numéro invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  street: z.string().min(5, "Adresse trop courte"),
  city: z.string().min(2, "Ville requise"),
  wilaya: z.string().min(1, "Région requise"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
          locale,
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            packaging: item.packaging,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError("Une erreur est survenue. Réessayez.");
        return;
      }

      clearCart();
      router.push(`/${locale}/order-success?n=${result.orderNumber}&t=${result.total}&phone=${encodeURIComponent(data.phone)}&name=${encodeURIComponent(data.firstName)}`);
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
        <main className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <p className="text-foreground/50 mb-4">Panier vide</p>
            <Link href={`/${locale}/shop`} className="btn-gold inline-block">
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
      <main className="min-h-screen pt-24">
        <div className="section-padding py-12 max-w-5xl mx-auto">
          <h1 className="luxury-heading text-4xl font-light text-foreground mb-10">
            {t("title")}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:col-span-3 space-y-6"
            >
              {/* Personal Info */}
              <div>
                <h2 className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
                  {t("personalInfo")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("firstName")}
                      placeholder={t("firstName")}
                      className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("lastName")}
                      placeholder={t("lastName")}
                      className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("phone")}
                      placeholder={t("phone")}
                      type="tel"
                      className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("email")}
                      placeholder={`${t("email")} (optionnel)`}
                      type="email"
                      className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h2 className="text-gold text-xs tracking-[0.2em] uppercase font-medium mb-4">
                  {t("address")}
                </h2>
                <div className="space-y-4">
                  <div>
                    <input
                      {...register("street")}
                      placeholder={t("street")}
                      className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                    />
                    {errors.street && (
                      <p className="text-red-400 text-xs mt-1">{errors.street.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        {...register("city")}
                        placeholder={t("city")}
                        className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors"
                      />
                      {errors.city && (
                        <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <select
                        {...register("wilaya")}
                        className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm focus:outline-none focus:border-gold transition-colors"
                        defaultValue=""
                      >
                        <option value="" disabled className="bg-background">
                          {t("wilaya")}
                        </option>
                        {WILAYAS.map((w) => (
                          <option key={w} value={w} className="bg-background">
                            {w}
                          </option>
                        ))}
                      </select>
                      {errors.wilaya && (
                        <p className="text-red-400 text-xs mt-1">{errors.wilaya.message}</p>
                      )}
                    </div>
                  </div>
                  <textarea
                    {...register("notes")}
                    placeholder={t("notes")}
                    rows={3}
                    className="w-full bg-surface border border-border px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gold/5 border border-gold/20 p-4 flex items-center gap-4">
                <Package size={20} className="text-gold shrink-0" />
                <div>
                  <p className="text-foreground/80 text-sm font-medium">{t("payment")}</p>
                  <p className="text-foreground/40 text-xs mt-0.5">{t("paymentDesc")}</p>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-gold w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? t("placing") : t("placeOrder")}
              </button>
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-surface border border-border p-6 sticky top-24">
                <h2 className="text-foreground/80 text-xs tracking-[0.2em] uppercase font-medium mb-6">
                  {t("orderSummary")}
                </h2>
                <div className="space-y-3 mb-6">
                  {items.map(({ product, quantity }) => {
                    const name =
                      locale === "en"
                        ? product.nameEn
                        : locale === "ar"
                        ? product.nameAr
                        : product.nameFr;
                    return (
                      <div key={product.id} className="flex justify-between text-xs">
                        <span className="text-foreground/60 truncate max-w-[70%]">
                          {name} × {quantity}
                        </span>
                        <span className="text-foreground/80 shrink-0">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Sous-total</span>
                    <span className="text-foreground/80">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/50">Livraison</span>
                    <span className="text-green-400 text-xs">Gratuite</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-gold">{formatPrice(subtotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
