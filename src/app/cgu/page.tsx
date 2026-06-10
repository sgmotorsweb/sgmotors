import { FileText } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</div>
  </div>
);

export default function CGU() {
  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><FileText className="h-6 w-6" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>Conditions Générales d&apos;Utilisation (CGU)</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Section title="1. Objet">
          <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site internet www.sgmotors.fr édité par SG MOTORS. En accédant au site, vous acceptez sans réserve les présentes CGU.</p>
        </Section>
        <Section title="2. Accès au site">
          <p>SG MOTORS s'efforce de garantir un accès continu au site, sans pouvoir toutefois garantir une disponibilité totale. Des opérations de maintenance ou des événements extérieurs peuvent entraîner une interruption temporaire.</p>
        </Section>
        <Section title="3. Utilisation du site">
          <p>L'utilisateur s'engage à utiliser le site conformément à la législation en vigueur et à ne pas perturber son fonctionnement. Toute utilisation frauduleuse ou abusive est strictement interdite.</p>
        </Section>
        <Section title="4. Cookies">
          <p>Le site utilise des cookies pour améliorer l'expérience utilisateur. L'utilisateur peut paramétrer ses préférences via le bandeau cookies ou les paramètres de son navigateur. Pour plus d'informations, consultez notre <a href="/rgpd" style={{ color: "var(--color-sg-accent-blue)" }}>Politique de Confidentialité</a>.</p>
        </Section>
        <Section title="5. Propriété intellectuelle">
          <p>Tous les contenus du site sont la propriété exclusive de SG MOTORS. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
        </Section>
        <Section title="6. Responsabilité">
          <p>SG MOTORS ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.</p>
        </Section>
        <Section title="7. Modification des CGU">
          <p>SG MOTORS se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par une mise à jour sur le site.</p>
        </Section>
        <Section title="8. Droit applicable">
          <p>Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux de Paris sont compétents.</p>
        </Section>
      </div>
    </div>
  );
}
