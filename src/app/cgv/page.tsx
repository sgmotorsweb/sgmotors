import { FileText } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</div>
  </div>
);

export default function CGV() {
  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><FileText className="h-6 w-6" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>Conditions Générales de Vente (CGV)</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Section title="1. Champ d'application">
          <p>Les présentes Conditions Générales de Vente s'appliquent à toutes les ventes de véhicules réalisées par SG MOTORS auprès de ses clients particuliers ou professionnels.</p>
        </Section>
        <Section title="2. Commande">
          <p>La commande est ferme et définitive dès la signature du bon de commande par les deux parties. Un acompte peut être demandé lors de la réservation du véhicule.</p>
        </Section>
        <Section title="3. Prix">
          <p>Les prix sont indiqués en euros TTC, hors frais d'immatriculation et de mise à la route. Les offres sont valables dans la limite des stocks disponibles.</p>
        </Section>
        <Section title="4. Paiement">
          <p>Le paiement peut être effectué par virement bancaire, chèque de banque ou carte bancaire. Des solutions de financement (crédit, LOA) sont proposées sous réserve d'acceptation par l'organisme financier partenaire.</p>
        </Section>
        <Section title="5. Livraison">
          <p>La livraison du véhicule est effectuée au siège de SG MOTORS ou au lieu convenu entre les parties. Le client doit vérifier l'état du véhicule au moment de la livraison.</p>
        </Section>
        <Section title="6. Garanties">
          <p>Chaque véhicule vendu bénéficie de la garantie légale de conformité et de la garantie contre les vices cachés. Des garanties commerciales supplémentaires peuvent être proposées selon le véhicule.</p>
        </Section>
        <Section title="7. Droit de rétractation">
          <p>Conformément à la législation en vigueur, le droit de rétractation ne s'applique pas aux ventes de véhicules conclus dans le cadre d'une vente en présentiel.</p>
        </Section>
        <Section title="8. Responsabilité">
          <p>SG MOTORS ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation du véhicule ou du non-respect des recommandations d'entretien.</p>
        </Section>
        <Section title="9. Litiges">
          <p>En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux de Paris seront compétents.</p>
        </Section>
      </div>
    </div>
  );
}
