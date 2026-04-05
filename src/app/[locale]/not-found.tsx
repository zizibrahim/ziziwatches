import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center section-padding py-24 max-w-lg mx-auto">
          {/* Gold divider top */}
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-transparent mx-auto mb-10 opacity-40" />

          <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Erreur 404</p>

          <h1 className="luxury-heading text-6xl sm:text-8xl font-light text-foreground/10 mb-2 select-none">
            404
          </h1>

          <h2 className="luxury-heading text-2xl sm:text-3xl font-light text-foreground mb-4">
            Page introuvable
          </h2>

          <p className="text-foreground/40 text-sm leading-relaxed mb-10">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
            Revenez à la boutique pour continuer votre exploration.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-gold px-8 py-3 text-sm">
              Retour à l&apos;accueil
            </Link>
            <Link href="/shop" className="btn-outline px-8 py-3 text-sm">
              Voir la boutique
            </Link>
          </div>

          {/* Gold divider bottom */}
          <div className="w-px h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent mx-auto mt-10 opacity-20" />
        </div>
      </main>
      <Footer />
    </>
  );
}
