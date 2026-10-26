import type { Metadata } from "next";
import SellForm from "../SellForm";

export const metadata: Metadata = {
  title: "Dépôt-vente / Mandat de vente gratuit | SG MOTORS Aubagne",
  description: "Confiez la vente de votre véhicule (moins de 15 ans, moins de 150 000 km) à SG MOTORS : service gratuit, visibilité professionnelle et gestion complète de la vente.",
  alternates: { canonical: "https://www.sgmotors.fr/vendre/depot-vente" },
};

export default function Page() {
  return <SellForm type="mandat" />;
}
