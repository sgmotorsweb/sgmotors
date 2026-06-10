import { Scale } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</div>
  </div>
);

export default function MentionsLegales() {
  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><Scale className="h-6 w-6" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>Mentions Légales</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Section title="1. Éditeur du site">
          <p><strong>SG MOTORS</strong><br />Société par Actions Simplifiée (SAS)<br />123 Avenue des Champs-Élysées, 75008 Paris<br />Immatriculée au RCS de Paris sous le numéro 123 456 789</p>
          <p>Numéro de TVA intracommunautaire : FR 12 345678901</p>
        </Section>
        <Section title="2. Directeur de la publication">
          <p>M. Stéphane Germain, Président de SG MOTORS.</p>
        </Section>
        <Section title="3. Hébergement">
          <p>Ce site est hébergé par Vercel Inc., 340 Pine Street, 3rd Floor, San Francisco, CA 94104, États-Unis.</p>
        </Section>
        <Section title="4. Propriété intellectuelle">
          <p>L'intégralité des contenus présents sur le site SG MOTORS (textes, images, vidéos, logos, marques, bases de données, etc.) est protégée par le droit d'auteur et le droit des marques. Toute reproduction, représentation, modification ou exploitation, même partielle, sans autorisation écrite préalable de SG MOTORS est interdite.</p>
        </Section>
        <Section title="5. Limitation de responsabilité">
          <p>SG MOTORS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur son site. Toutefois, SG MOTORS ne saurait garantir l'exhaustivité, l'exactitude ou l'absence de modification par un tiers. SG MOTORS décline toute responsabilité en cas de dommage direct ou indirect résultant de l'utilisation du site.</p>
        </Section>
        <Section title="6. Liens hypertextes">
          <p>Le site peut contenir des liens hypertextes vers d'autres sites. SG MOTORS n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou leurs pratiques en matière de données personnelles.</p>
        </Section>
        <Section title="7. Droit applicable">
          <p>Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </Section>
      </div>
    </div>
  );
}
