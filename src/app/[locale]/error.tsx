"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center section-padding py-24 max-w-lg mx-auto">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gold to-transparent mx-auto mb-10 opacity-40" />

        <p className="text-gold text-xs tracking-[0.4em] uppercase mb-4">Erreur inattendue</p>

        <h1 className="luxury-heading text-3xl font-light text-foreground mb-4">
          Quelque chose s&apos;est mal passé
        </h1>

        <p className="text-foreground/40 text-sm leading-relaxed mb-10">
          Une erreur est survenue. Veuillez réessayer ou revenir à l&apos;accueil.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-gold px-8 py-3 text-sm">
            Réessayer
          </button>
          <Link href="/" className="btn-outline px-8 py-3 text-sm">
            Retour à l&apos;accueil
          </Link>
        </div>

        <div className="w-px h-16 bg-gradient-to-b from-gold via-gold/50 to-transparent mx-auto mt-10 opacity-20" />
      </div>
    </main>
  );
}
