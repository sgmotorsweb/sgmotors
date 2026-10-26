import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import Hero from "@/components/Hero";
import VehicleCard, { isPublicVehicle } from "@/components/VehicleCard";
import { getServerVehicles } from "@/lib/vehicles-server";
import type { VehicleData } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SG MOTORS | Achat, vente et recherche de véhicules d'occasion à Aubagne",
  description: "Achat, vente et recherche personnalisée de véhicules d'occasion sélectionnés avec soin chez SG MOTORS à Aubagne. Reprise et dépôt-vente possibles.",
  alternates: {
    canonical: "https://www.sgmotors.fr",
  },
  openGraph: {
    title: "SG MOTORS | Achat, vente et recherche de véhicules d'occasion",
    description: "Véhicules d'occasion sélectionnés avec soin, reprise, dépôt-vente et recherche personnalisée à Aubagne.",
    url: "https://www.sgmotors.fr",
    siteName: "SG MOTORS",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SG MOTORS | Achat, vente et recherche de véhicules d'occasion",
    description: "Véhicules d'occasion sélectionnés avec soin, reprise, dépôt-vente et recherche personnalisée à Aubagne.",
  },
};

const SERVICES = [
  { href: "/acheter", icon: CarFront, title: "Acheter", text: "Découvrez nos véhicules disponibles" },
  { href: "/vendre", icon: RefreshCw, title: "Vendre", text: "Reprise, dépôt-vente ou mandat" },
  { href: "/recherche-personnalisee", icon: Search, title: "Recherche personnalisée", text: "Trouvez le véhicule selon vos critères" },
];

async function getLatestVehicles(): Promise<VehicleData[]> {
  try {
    const vehicles = await getServerVehicles();
    return vehicles.filter(isPublicVehicle).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const latest = await getLatestVehicles();

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <Hero
        eyebrow="Véhicules d'occasion"
        title="Trouvez votre"
        highlight="prochain véhicule"
        subtitle="Achat, vente et recherche personnalisée de véhicules sélectionnés avec soin."
        features={[
          { icon: ShieldCheck, label: "Véhicules sélectionnés" },
          { icon: Users, label: "Accompagnement personnalisé" },
          { icon: RefreshCw, label: "Reprise possible" },
        ]}
      />

      <section className="relative z-10 px-4 md:-mt-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {SERVICES.map(({ href, icon: Icon, title, text }) => (
              <Link key={href} href={href}
                className="group flex flex-col items-center text-center rounded-2xl border px-6 py-9 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-md)" }}>
                <Icon className="h-11 w-11 mb-4" strokeWidth={1.75} style={{ color: "var(--color-sg-accent-blue)" }} />
                <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
                <span className="block w-8 h-0.5 rounded-full my-3" style={{ backgroundColor: "var(--color-sg-accent-blue)" }} />
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{text}</p>
                <span className="mt-auto inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white transition-opacity group-hover:opacity-90" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  En savoir plus <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="eyebrow mb-3">Notre catalogue</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Nos derniers véhicules</h2>
            </div>
            <Link href="/acheter" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>
              Voir tout le catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {latest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latest.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
            </div>
          ) : (
            <p className="py-12 text-center rounded-2xl border" style={{ color: "var(--text-muted)", borderColor: "var(--border-primary)", backgroundColor: "var(--bg-card)" }}>
              Nos prochains véhicules arrivent très bientôt.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
