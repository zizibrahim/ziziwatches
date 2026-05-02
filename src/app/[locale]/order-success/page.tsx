"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CheckCircle, Package, Phone, MessageCircle, ArrowRight, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/utils";

const STORE_WHATSAPP = "212717728154";

function OrderSuccessContent() {
  const locale = useLocale();
  const params = useSearchParams();

  const orderNumber = params.get("n") ?? "#----";
  const total = parseFloat(params.get("t") ?? "0");
  const phone = params.get("phone") ?? "";
  const name = params.get("name") ?? "";

  const waMessage = encodeURIComponent(
    `Bonjour ! Ma commande ${orderNumber} a bien été passée. Merci de confirmer.`
  );
  const waLink = `https://wa.me/${STORE_WHATSAPP}?text=${waMessage}`;

  return (
    <main className="min-h-screen pt-28 pb-20 section-padding flex items-center justify-center">
      <div className="w-full max-w-lg">

        {/* Success card */}
        <div className="border border-border bg-surface p-8 md:p-10">

          {/* Icon + heading */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-olive/10 border border-olive/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-olive" strokeWidth={1.5} />
            </div>
            <p className="text-xs tracking-[0.35em] uppercase text-olive mb-2 font-medium">
              Commande reçue
            </p>
            <h1 className="luxury-heading text-3xl font-light text-foreground">
              Merci {name && `, ${name}`}!
            </h1>
            <p className="text-foreground/50 text-sm mt-2 leading-relaxed">
              Votre commande a été passée avec succès.
            </p>
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-olive/40 mx-auto mb-8" />

          {/* Order details */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-foreground/40 text-xs tracking-wider uppercase">Numéro de commande</span>
              <span className="text-foreground font-mono text-sm font-medium">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-foreground/40 text-xs tracking-wider uppercase">Total</span>
              <span className="text-olive font-medium text-sm">{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <span className="text-foreground/40 text-xs tracking-wider uppercase">Paiement</span>
              <span className="flex items-center gap-1.5 text-foreground/70 text-sm">
                <Package size={13} className="text-olive" />
                Paiement à la livraison
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-foreground/40 text-xs tracking-wider uppercase">Statut</span>
              <span className="text-xs px-2.5 py-1 bg-yellow-400/10 text-yellow-400 rounded-full">
                En attente de confirmation
              </span>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-olive/5 border border-olive/20 p-4 mb-8 flex gap-3">
            <Phone size={16} className="text-olive shrink-0 mt-0.5" />
            <p className="text-foreground/60 text-xs leading-relaxed">
              Notre équipe vous contactera au <span className="text-foreground/90 font-medium">{phone || "numéro fourni"}</span> pour confirmer votre commande et organiser la livraison.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs tracking-wider uppercase font-semibold px-5 py-3 hover:bg-[#20bc59] transition-colors"
            >
              <MessageCircle size={14} />
              Contacter via WhatsApp
            </a>
            <Link
              href={`/${locale}`}
              className="flex-1 flex items-center justify-center gap-2 border border-border text-foreground/60 text-xs tracking-wider uppercase px-5 py-3 hover:border-olive/40 hover:text-foreground transition-colors"
            >
              <ArrowRight size={14} />
              Continuer les achats
            </Link>
          </div>

          <Link
            href={`/${locale}`}
            className="flex items-center justify-center gap-1.5 mt-4 text-foreground/25 hover:text-foreground/50 text-xs transition-colors"
          >
            <Home size={11} /> Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen pt-28 pb-20 flex items-center justify-center">
          <div className="w-16 h-16 border border-border rounded-full animate-pulse" />
        </main>
      }>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
