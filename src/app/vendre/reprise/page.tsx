import type { Metadata } from "next";
import SellForm from "../SellForm";

export const metadata: Metadata = {
  title: "Reprise de véhicule : estimation rapide | SG MOTORS Aubagne",
  description: "Obtenez une estimation rapide et revendez votre véhicule simplement : paiement sous 48h, démarches simplifiées, aucun SAV.",
  alternates: { canonical: "https://www.sgmotors.fr/vendre/reprise" },
};

export default function Page() {
  return <SellForm type="reprise" />;
}
