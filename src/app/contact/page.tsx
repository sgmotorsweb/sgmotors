import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contactez-nous | SG MOTORS Aubagne",
  description: "Prenez contact avec l'équipe commerciale de SG MOTORS à Aubagne. Des questions sur l'achat, la vente ou la reprise de votre véhicule ? Écrivez-nous.",
  alternates: {
    canonical: "https://www.sgmotors.fr/contact",
  },
  openGraph: {
    title: "Contactez-nous | SG MOTORS Aubagne",
    description: "Prenez contact avec l'équipe de SG MOTORS à Aubagne pour l'achat, la vente ou la reprise de votre véhicule.",
    url: "https://www.sgmotors.fr/contact",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <ContactClient />;
}
