import type { Metadata } from "next";
import RepriseClient from "./RepriseClient";

export const metadata: Metadata = {
  title: "Estimation & Reprise de Voiture Gratuite | SG MOTORS",
  description: "Remplissez notre formulaire rapide pour obtenir une estimation de reprise de votre véhicule. Rachat cash rapide, sécurisé et sans engagement chez SG MOTORS à Aubagne.",
  alternates: {
    canonical: "https://www.sgmotors.fr/reprise",
  },
  openGraph: {
    title: "Estimation & Reprise de Voiture Gratuite | SG MOTORS",
    description: "Obtenez une offre de reprise rapide et sécurisée pour votre voiture chez SG MOTORS à Aubagne.",
    url: "https://www.sgmotors.fr/reprise",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <RepriseClient />;
}
