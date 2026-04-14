import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Shield, Database, Share2, Lock, Cookie, UserCheck, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — Ziziwatches",
};

const sections = [
  {
    number: "01",
    icon: Database,
    title: "Données collectées",
    content: (
      <>
        <p className="text-foreground/60 leading-relaxed mb-4">
          Lors d'une commande sur notre site, nous collectons les informations suivantes :
        </p>
        <ul className="space-y-2.5">
          {["Nom et prénom", "Numéro de téléphone", "Adresse de livraison", "Ville et région"].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
              <span className="text-foreground/70 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "02",
    icon: Shield,
    title: "Utilisation des données",
    content: (
      <>
        <p className="text-foreground/60 leading-relaxed mb-4">
          Ces informations sont utilisées uniquement pour :
        </p>
        <ul className="space-y-2.5">
          {[
            "Traiter et confirmer votre commande",
            "Organiser la livraison à votre adresse",
            "Vous contacter en cas de besoin concernant votre commande",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
              <span className="text-foreground/70 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "03",
    icon: Share2,
    title: "Partage des données",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Vos données personnelles ne sont <span className="text-foreground/90 font-medium">jamais vendues</span> ni
        partagées à des fins commerciales. Elles peuvent être transmises uniquement au service de livraison
        partenaire, dans le but exclusif d'acheminer votre commande.
      </p>
    ),
  },
  {
    number: "04",
    icon: Lock,
    title: "Sécurité",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations
        contre tout accès non autorisé, modification ou divulgation.
      </p>
    ),
  },
  {
    number: "05",
    icon: Cookie,
    title: "Cookies",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Notre site utilise des cookies techniques uniquement pour assurer le bon fonctionnement
        du panier d'achat. <span className="text-foreground/90 font-medium">Aucun cookie publicitaire</span> ou
        de traçage n'est utilisé.
      </p>
    ),
  },
  {
    number: "06",
    icon: UserCheck,
    title: "Vos droits",
    content: (
      <>
        <p className="text-foreground/60 leading-relaxed mb-5">
          Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès,
          de rectification et de suppression de vos données personnelles.
        </p>
        <a
          href="mailto:asmaezouggari08@gmail.com"
          className="inline-flex items-center gap-2 text-gold text-sm hover:underline"
        >
          <Mail size={13} />
          asmaezouggari08@gmail.com
        </a>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* ── Hero ── */}
        <div className="relative pt-28 pb-16 border-b border-border overflow-hidden">
          {/* Decorative gold lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gold/40 to-transparent" />
          </div>

          <div className="section-padding text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold/50" />
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase font-medium">
                Ziziwatches · Légal
              </p>
              <div className="w-8 h-px bg-gold/50" />
            </div>
            <h1 className="luxury-heading text-5xl md:text-6xl font-light text-foreground mb-4">
              Politique de
              <br />
              <span className="gold-text">Confidentialité</span>
            </h1>
            <p className="text-foreground/40 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Nous respectons votre vie privée. Voici comment nous collectons,
              utilisons et protégeons vos données.
            </p>
            <p className="text-foreground/25 text-xs mt-6 tracking-wider uppercase">
              Dernière mise à jour — Avril 2026
            </p>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="section-padding py-16 max-w-4xl mx-auto">

          {/* Quick summary banner */}
          <div className="bg-gold/5 border border-gold/20 p-6 mb-14 flex items-start gap-4">
            <Shield size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground/80 text-sm font-medium mb-1">En résumé</p>
              <p className="text-foreground/50 text-xs leading-relaxed">
                Vos données ne sont collectées que pour traiter votre commande et organiser
                la livraison. Elles ne sont jamais vendues. Vous pouvez demander leur
                suppression à tout moment en nous contactant.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-0">
            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.number}
                  className={`flex gap-6 md:gap-10 py-10 ${
                    i < sections.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  {/* Number + icon */}
                  <div className="shrink-0 flex flex-col items-center gap-3 pt-1">
                    <span className="luxury-heading text-3xl font-light text-gold/20 leading-none select-none">
                      {section.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Icon size={14} className="text-gold" strokeWidth={1.5} />
                    </div>
                    {i < sections.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-gold/20 to-transparent min-h-[2rem]" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-foreground text-base font-medium tracking-wide mb-4">
                      {section.title}
                    </h2>
                    {section.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact CTA */}
          <div className="mt-14 border border-border bg-surface p-8 text-center">
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-3">Contact</p>
            <p className="text-foreground/80 text-sm mb-1 font-medium">
              Une question sur vos données ?
            </p>
            <p className="text-foreground/40 text-xs mb-6 leading-relaxed max-w-xs mx-auto">
              Notre équipe est disponible pour répondre à toutes vos questions
              concernant la confidentialité.
            </p>
            <a
              href="mailto:asmaezouggari08@gmail.com"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Mail size={13} />
              Nous contacter
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
