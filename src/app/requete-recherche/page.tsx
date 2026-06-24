import type { Metadata } from "next";
import RequeteRechercheClient from "./RequeteRechercheClient";

export const metadata: Metadata = {
  title: "Recherche Personnalisée de Véhicule | SG MOTORS",
  description: "Vous cherchez un modèle de véhicule d'occasion précis ? Confiez votre recherche personnalisée à SG MOTORS à Aubagne. Nous trouvons votre voiture idéale grâce à notre réseau de partenaires professionnels.",
  alternates: {
    canonical: "https://www.sgmotors.fr/requete-recherche",
  },
  openGraph: {
    title: "Recherche Personnalisée de Véhicule | SG MOTORS",
    description: "Confiez votre recherche personnalisée à SG MOTORS à Aubagne. Nous trouvons votre voiture idéale.",
    url: "https://www.sgmotors.fr/requete-recherche",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <RequeteRechercheClient />;
}
