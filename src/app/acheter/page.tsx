import type { Metadata } from "next";
import AcheterClient from "./AcheterClient";

export const metadata: Metadata = {
  title: "Acheter un véhicule d'occasion | SG MOTORS Aubagne",
  description: "Découvrez notre catalogue de véhicules d'occasion sélectionnés, contrôlés et garantis chez SG MOTORS à Aubagne.",
  alternates: {
    canonical: "https://www.sgmotors.fr/acheter",
  },
  openGraph: {
    title: "Acheter un véhicule d'occasion | SG MOTORS",
    description: "Véhicules d'occasion sélectionnés, contrôlés et garantis à Aubagne.",
    url: "https://www.sgmotors.fr/acheter",
    siteName: "SG MOTORS",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <AcheterClient />;
}
