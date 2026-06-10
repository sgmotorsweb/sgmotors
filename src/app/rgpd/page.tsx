import { Shield } from "lucide-react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</div>
  </div>
);

export default function RGPD() {
  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><Shield className="h-6 w-6" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>Politique de Confidentialité (RGPD)</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Section title="1. Responsable du traitement">
          <p>Le responsable du traitement de vos données personnelles est la société <strong>SG MOTORS</strong>, SAS immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé 123 Avenue des Champs-Élysées, 75008 Paris.</p>
        </Section>
        <Section title="2. Données collectées">
          <p>Nous collectons les données suivantes : nom, prénom, adresse e-mail, numéro de téléphone, plaque d'immatriculation, informations sur votre véhicule (marque, modèle, année, kilométrage, etc.) et toute information que vous nous fournissez via les formulaires de contact ou de reprise.</p>
        </Section>
        <Section title="3. Finalités du traitement">
          <p>Vos données sont collectées pour : la gestion des demandes de contact et de reprise, la gestion des alertes véhicules, la réponse à vos demandes commerciales, l'amélioration de nos services, et le respect de nos obligations légales.</p>
        </Section>
        <Section title="4. Base légale">
          <p>Le traitement de vos données repose sur votre consentement (formulaires de contact) et sur l'exécution de mesures précontractuelles (demandes de reprise, alertes véhicules).</p>
        </Section>
        <Section title="5. Durée de conservation">
          <p>Vos données sont conservées pour la durée nécessaire à la gestion de votre demande, soit 3 ans à compter de votre dernier contact. Les données comptables et fiscales sont conservées 10 ans.</p>
        </Section>
        <Section title="6. Destinataires des données">
          <p>Vos données sont destinées exclusivement à SG MOTORS. Elles ne sont pas transmises à des tiers sans votre accord préalable, sauf obligation légale ou demande d'une autorité compétente.</p>
        </Section>
        <Section title="7. Vos droits RGPD">
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification des données inexactes</li>
            <li>Droit à l'effacement (droit à l'oubli)</li>
            <li>Droit à la limitation du traitement</li>
            <li>Droit à la portabilité des données</li>
            <li>Droit d'opposition au traitement</li>
          </ul>
          <p className="mt-3">Pour exercer vos droits, contactez-nous à : <a href="mailto:contact@sgmotors13.com" style={{ color: "var(--color-sg-accent-blue)" }}>contact@sgmotors13.com</a> ou par courrier au siège social.</p>
        </Section>
        <Section title="8. Cookies">
          <p>Notre site utilise des cookies strictement nécessaires à son fonctionnement, des cookies de performance et des cookies de ciblage. Vous pouvez gérer vos préférences via le bandeau cookies. Vous pouvez également configurer votre navigateur pour refuser les cookies.</p>
        </Section>
        <Section title="9. Transferts hors UE">
          <p>Vos données ne font pas l'objet de transferts en dehors de l'Union européenne, sauf nécessité technique liée à l'hébergement (États-Unis) dans le cadre des garanties prévues par le Data Privacy Framework.</p>
        </Section>
      </div>
    </div>
  );
}
