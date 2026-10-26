import type { Metadata } from "next";
import RechercheClient from "./RechercheClient";

export const metadata: Metadata = {
  title: "Recherche Personnalisée de Véhicule | SG MOTORS",
  description: "Vous cherchez un modèle de véhicule d'occasion précis ? Confiez votre recherche personnalisée à SG MOTORS à Aubagne. Nous trouvons votre voiture idéale grâce à notre réseau de partenaires professionnels.",
  alternates: {
    canonical: "https://www.sgmotors.fr/recherche-personnalisee",
  },
  openGraph: {
    title: "Recherche Personnalisée de Véhicule | SG MOTORS",
    description: "Confiez votre recherche personnalisée à SG MOTORS à Aubagne. Nous trouvons votre voiture idéale.",
    url: "https://www.sgmotors.fr/recherche-personnalisee",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <RechercheClient />;
}
