import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FileText, Package, ShoppingBag, Tag, Banknote, Truck, RotateCcw, AlertCircle, Shield, Scale, Phone, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — Ziziwatches",
};

const highlights = [
  { icon: Truck, label: "Livraison gratuite", sub: "Partout au Maroc" },
  { icon: Banknote, label: "Paiement à la livraison", sub: "En espèces uniquement" },
  { icon: RotateCcw, label: "Retour sous 7 jours", sub: "Produit défectueux" },
  { icon: Phone, label: "Support WhatsApp", sub: "0717728154" },
];

const articles = [
  {
    number: "01",
    icon: FileText,
    title: "Objet",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Les présentes conditions générales de vente régissent les relations contractuelles entre
        <span className="text-foreground/90 font-medium"> Ziziwatches</span> et ses clients dans
        le cadre de la vente en ligne de montres et accessoires.
      </p>
    ),
  },
  {
    number: "02",
    icon: Package,
    title: "Produits",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Les produits proposés sont des montres et accessoires de qualité. Chaque produit est décrit
        avec soin sur notre site. Les photos sont présentées à titre illustratif et peuvent légèrement
        différer du produit réel.
      </p>
    ),
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Commande",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Pour passer commande, le client sélectionne les produits souhaités, remplit le formulaire
        de livraison, puis valide sa commande. Notre équipe contacte ensuite le client pour confirmer
        la commande avant expédition.
      </p>
    ),
  },
  {
    number: "04",
    icon: Tag,
    title: "Prix",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Les prix sont affichés en <span className="text-foreground/90 font-medium">dirhams marocains (MAD)</span>,
        toutes taxes comprises. Ziziwatches se réserve le droit de modifier les prix à tout moment,
        mais les produits seront facturés au tarif en vigueur au moment de la commande.
      </p>
    ),
  },
  {
    number: "05",
    icon: Banknote,
    title: "Paiement",
    content: (
      <div className="space-y-3">
        <p className="text-foreground/60 leading-relaxed">
          Le paiement s'effectue exclusivement <span className="text-foreground/90 font-medium">à la livraison</span> (paiement
          en espèces). Aucun paiement en ligne n'est requis pour passer commande.
        </p>
        <div className="inline-flex items-center gap-2 bg-gold/5 border border-gold/20 px-3 py-2 text-xs text-gold">
          <Banknote size={12} />
          Paiement à la livraison — 100% sécurisé
        </div>
      </div>
    ),
  },
  {
    number: "06",
    icon: Truck,
    title: "Livraison",
    content: (
      <div className="space-y-3">
        <p className="text-foreground/60 leading-relaxed">
          Nous livrons <span className="text-foreground/90 font-medium">partout au Maroc</span>. La livraison
          est <span className="text-foreground/90 font-medium">gratuite</span> pour toutes les commandes.
        </p>
        <p className="text-foreground/60 leading-relaxed">
          Le délai de livraison est généralement de <span className="text-foreground/90 font-medium">24 à 48 heures</span> après
          confirmation de la commande.
        </p>
      </div>
    ),
  },
  {
    number: "07",
    icon: RotateCcw,
    title: "Retours et remboursements",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        En cas de produit défectueux ou non conforme, le client peut demander un retour dans les{" "}
        <span className="text-foreground/90 font-medium">7 jours</span> suivant la réception.
        Contactez-nous pour organiser le retour et obtenir un remboursement ou un échange.
      </p>
    ),
  },
  {
    number: "08",
    icon: AlertCircle,
    title: "Responsabilité",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Ziziwatches ne peut être tenue responsable des retards de livraison dus à des circonstances
        indépendantes de sa volonté (force majeure, grève, intempéries, etc.).
      </p>
    ),
  },
  {
    number: "09",
    icon: Shield,
    title: "Protection des données",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Les données personnelles collectées lors de la commande sont utilisées uniquement pour le
        traitement et la livraison de celle-ci. Elles ne sont{" "}
        <span className="text-foreground/90 font-medium">jamais revendues</span> à des tiers.
      </p>
    ),
  },
  {
    number: "10",
    icon: Scale,
    title: "Droit applicable",
    content: (
      <p className="text-foreground/60 leading-relaxed">
        Les présentes CGV sont soumises au <span className="text-foreground/90 font-medium">droit marocain</span>.
        Tout litige relatif à leur interprétation et/ou leur exécution relève des tribunaux marocains compétents.
      </p>
    ),
  },
  {
    number: "11",
    icon: Phone,
    title: "Contact",
    content: (
      <div className="space-y-3">
        <p className="text-foreground/60 leading-relaxed mb-4">
          Pour toute question relative à ces conditions de vente :
        </p>
        <a
          href="mailto:asmaezouggari08@gmail.com"
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Mail size={13} className="text-gold" />
          </div>
          <span className="text-foreground/60 text-sm group-hover:text-gold transition-colors">
            asmaezouggari08@gmail.com
          </span>
        </a>
        <a
          href="tel:0717728154"
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Phone size={13} className="text-gold" />
          </div>
          <span className="text-foreground/60 text-sm group-hover:text-gold transition-colors font-mono">
            0717728154
          </span>
        </a>
      </div>
    ),
  },
];

export default function CgvPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* ── Hero ── */}
        <div className="relative pt-28 pb-16 border-b border-border overflow-hidden">
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
              Conditions Générales
              <br />
              <span className="gold-text">de Vente</span>
            </h1>
            <p className="text-foreground/40 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Tout ce que vous devez savoir sur nos conditions de vente,
              de livraison et de retour.
            </p>
            <p className="text-foreground/25 text-xs mt-6 tracking-wider uppercase">
              Dernière mise à jour — Avril 2026
            </p>
          </div>
        </div>

        {/* ── Key highlights ── */}
        <div className="border-b border-border bg-surface/50">
          <div className="section-padding py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-foreground/80 text-xs font-medium leading-tight">{label}</p>
                    <p className="text-foreground/35 text-[11px] mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Articles ── */}
        <div className="section-padding py-16 max-w-4xl mx-auto">
          <div className="space-y-0">
            {articles.map((article, i) => {
              const Icon = article.icon;
              return (
                <div
                  key={article.number}
                  className={`flex gap-6 md:gap-10 py-10 ${
                    i < articles.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  {/* Number + icon */}
                  <div className="shrink-0 flex flex-col items-center gap-3 pt-1">
                    <span className="luxury-heading text-3xl font-light text-gold/20 leading-none select-none">
                      {article.number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Icon size={14} className="text-gold" strokeWidth={1.5} />
                    </div>
                    {i < articles.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-gold/20 to-transparent min-h-[2rem]" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1.5">
                      Article {article.number}
                    </p>
                    <h2 className="text-foreground text-base font-medium tracking-wide mb-4">
                      {article.title}
                    </h2>
                    {article.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-border bg-surface p-6">
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-2">Besoin d'aide ?</p>
              <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                Notre équipe est disponible pour répondre à toutes vos questions.
              </p>
              <a
                href="mailto:asmaezouggari08@gmail.com"
                className="btn-gold inline-flex items-center gap-2 text-xs"
              >
                <Mail size={12} />
                Envoyer un email
              </a>
            </div>
            <div className="border border-border bg-surface p-6">
              <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-2">WhatsApp</p>
              <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                Réponse rapide via WhatsApp du lundi au samedi.
              </p>
              <a
                href="https://wa.me/212717728154"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#25D366]/30 text-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors text-xs tracking-wider uppercase px-4 py-2.5"
              >
                <Phone size={12} />
                0717728154
              </a>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
