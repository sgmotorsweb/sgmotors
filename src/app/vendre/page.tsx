import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Banknote, ChartNoAxesColumnIncreasing, CircleCheck, Euro, HandCoins,
  Handshake, Info, RefreshCw, Settings, Timer, TrendingUp,
} from "lucide-react";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "Vendre mon véhicule : reprise ou dépôt-vente | SG MOTORS Aubagne",
  description: "Vendez votre véhicule simplement avec SG MOTORS à Aubagne : reprise avec paiement sous 48h ou dépôt-vente / mandat gratuit avec gestion complète de la vente.",
  alternates: {
    canonical: "https://www.sgmotors.fr/vendre",
  },
  openGraph: {
    title: "Vendre mon véhicule | SG MOTORS",
    description: "Reprise avec paiement sous 48h ou dépôt-vente gratuit : SG MOTORS gère la vente de votre véhicule.",
    url: "https://www.sgmotors.fr/vendre",
    siteName: "SG MOTORS",
    type: "website",
    locale: "fr_FR",
  },
};

const OPTIONS = [
  {
    href: "/vendre/depot-vente",
    icon: HandCoins,
    title: "Dépôt-vente / Mandat",
    condition: "Véhicule de moins de 15 ans et moins de 150 000 km",
    text: "Vous nous confiez ou vous gardez le véhicule, on gère la vente de A à Z.",
    perks: ["Gratuit", "Visibilité professionnelle", "Gestion complète de la vente"],
    cta: "Confier la vente de mon véhicule",
  },
  {
    href: "/vendre/reprise",
    icon: RefreshCw,
    title: "Reprise",
    condition: null,
    text: "Obtenez une estimation rapide et revendez votre véhicule simplement.",
    perks: ["Paiement sous 48h", "Démarches simplifiées", "Aucun SAV"],
    cta: "Faire estimer mon véhicule",
  },
];

const WHY = [
  { icon: Euro, title: "Service 100% gratuit", text: "pour le vendeur" },
  { icon: Settings, title: "Gestion complète", text: "de la vente" },
  { icon: ChartNoAxesColumnIncreasing, title: "Annonces professionnelles", text: "+100% de visibilité\n+200% de contacts" },
  { icon: TrendingUp, title: "Prix fixé selon le marché", text: "Toujours plus avantageux qu'une simple reprise." },
];

export default function VendrePage() {
  return (
    <div className="flex flex-col flex-1 bg-primary">
      <Hero
        eyebrow="Vendre votre véhicule"
        title="Vendez votre véhicule"
        highlight="en toute sérénité"
        subtitle="Reprise immédiate ou dépôt-vente : choisissez la solution qui vous convient, nous nous occupons du reste."
        features={[
          { icon: Timer, label: "Estimation rapide" },
          { icon: Banknote, label: "Paiement sous 48h" },
          { icon: Handshake, label: "Accompagnement de A à Z" },
        ]}
      />

      <section className="relative z-10 px-4 md:-mt-10 pb-16 md:pb-20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPTIONS.map(({ href, icon: Icon, title, condition, text, perks, cta }) => (
              <Link key={href} href={href}
                className="group flex flex-col rounded-2xl border p-8 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-sg-accent-blue)]"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-md)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--badge-bg)" }}>
                  <Icon className="h-8 w-8" strokeWidth={1.75} style={{ color: "var(--color-sg-accent-blue)" }} />
                </div>
                <h2 className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{title}</h2>
                {condition && (
                  <p className="mt-3 inline-flex items-start gap-2 self-start text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                    <Info className="h-3.5 w-3.5 mt-px shrink-0" style={{ color: "var(--color-sg-accent-blue)" }} />{condition}
                  </p>
                )}
                <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{text}</p>
                <ul className="mt-6 mb-8 space-y-3">
                  {perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-[0.95rem] font-semibold" style={{ color: "var(--text-primary)" }}>
                      <CircleCheck className="h-5 w-5 shrink-0" style={{ color: "var(--color-sg-accent-blue)" }} />{perk}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white transition-opacity group-hover:opacity-90" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 border-t" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12" style={{ color: "var(--text-primary)" }}>
            Pourquoi passer par <span style={{ color: "var(--color-sg-accent-blue)" }}>SG Motors</span> ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {WHY.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)" }}>
                  <Icon className="h-7 w-7" strokeWidth={1.75} style={{ color: "var(--color-sg-accent-blue)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--color-sg-accent-blue)" }}>{title}</h3>
                  <p className="mt-0.5 whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
