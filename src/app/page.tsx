import type { Metadata } from "next";
import CatalogueClient from "./CatalogueClient";

export const metadata: Metadata = {
  title: "SG MOTORS | Achat, Vente & Conseil Automobile à Aubagne",
  description: "Découvrez notre catalogue de véhicules d'occasion sélectionnés, révisés et garantis chez SG MOTORS à Aubagne. Estimation gratuite de reprise et recherche personnalisée.",
  alternates: {
    canonical: "https://www.sgmotors.fr",
  },
  openGraph: {
    title: "SG MOTORS | Achat, Vente & Conseil Automobile à Aubagne",
    description: "Découvrez notre catalogue de véhicules d'occasion sélectionnés et garantis à Aubagne.",
    url: "https://www.sgmotors.fr",
    siteName: "SG MOTORS",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "SG MOTORS | Achat, Vente & Conseil Automobile à Aubagne",
    description: "Découvrez notre catalogue de véhicules d'occasion sélectionnés et garantis à Aubagne.",
  },
};

export default function Page() {
  return <CatalogueClient />;
}
