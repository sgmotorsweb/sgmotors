import type { Metadata } from "next";
import MentionsLegalesClient from "./MentionsLegalesClient";

export const metadata: Metadata = {
  title: "Mentions Légales | SG MOTORS",
  description: "Retrouvez les mentions légales du site SG MOTORS, entreprise spécialisée dans l'achat, la vente et le dépôt-vente de véhicules à Aubagne (13400).",
  alternates: {
    canonical: "https://www.sgmotors.fr/mentions-legales",
  },
  openGraph: {
    title: "Mentions Légales | SG MOTORS",
    description: "Informations légales concernant l'éditeur et l'hébergeur du site de SG MOTORS à Aubagne.",
    url: "https://www.sgmotors.fr/mentions-legales",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Page() {
  return <MentionsLegalesClient />;
}
