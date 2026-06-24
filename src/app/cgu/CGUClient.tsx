"use client";

import { Info, Car, FileText, AlertTriangle, UserCheck, Scale } from "lucide-react";
import LegalLayout from "@/components/LegalLayout";

export default function CGUClient() {
  const sections = [
    {
      id: "objet",
      title: "1. Objet des CGU",
      icon: <Info className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») ont pour objet de définir les modalités 
            et conditions d&apos;accès et d&apos;utilisation du site internet <strong>sgmotors.fr</strong> (ci-après « le Site ») 
            et des services qui y sont proposés par la société <strong>SG MOTORS</strong>.
          </p>
          <p>
            L&apos;accès et l&apos;utilisation du Site par tout internaute impliquent l&apos;acceptation expresse et sans réserve des présentes CGU. 
            Si vous n&apos;acceptez pas ces conditions, vous devez cesser d&apos;utiliser le Site.
          </p>
        </div>
      ),
    },
    {
      id: "services",
      title: "2. Description des services",
      icon: <Car className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Le Site a pour vocation de présenter les activités de la société SG MOTORS et de fournir à l&apos;utilisateur un ensemble d&apos;outils 
            et de services liés à l&apos;automobile :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Catalogue en ligne :</strong> Consultation des fiches descriptives des véhicules neufs et d&apos;occasion disponibles à la vente ou en cours de dépôt-vente (photographies, caractéristiques techniques, équipements, prix).</li>
            <li><strong>Reprise de véhicule :</strong> Outil de demande d&apos;estimation en ligne de la valeur de votre véhicule actuel en vue d&apos;une reprise commerciale.</li>
            <li><strong>Requête de recherche :</strong> Formulaire permettant de transmettre des critères d&apos;achat spécifiques pour que notre équipe effectue une recherche personnalisée de véhicule (mandat d&apos;intermédiation).</li>
            <li><strong>Alertes véhicules :</strong> Inscription pour recevoir des notifications en cas d&apos;ajout de nouveaux véhicules correspondant à vos critères.</li>
            <li><strong>Prise de contact :</strong> Formulaire de contact permettant de solliciter des informations commerciales et de prendre rendez-vous.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "propriete",
      title: "3. Propriété intellectuelle",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            La structure générale du Site, ainsi que les textes, graphiques, logos, sons, images, photographies (notamment les clichés 
            des véhicules présentés), et vidéos figurant sur celui-ci, sont la propriété de <strong>SG MOTORS</strong> ou de ses partenaires.
          </p>
          <p>
            Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le Site, 
            par quelque procédé que ce soit, sans l&apos;autorisation préalable et par écrit de SG MOTORS, est strictement interdite et serait susceptible 
            de constituer une contrefaçon au sens du Code de la propriété intellectuelle.
          </p>
        </div>
      ),
    },
    {
      id: "responsabilite-editeur",
      title: "4. Responsabilité de l'éditeur",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            <strong>SG MOTORS</strong> met en œuvre des moyens raisonnables pour s&apos;assurer que les informations diffusées sur le Site 
            (notamment les prix, options, équipements et kilométrages des véhicules) sont exactes et à jour. Néanmoins, les fiches de véhicules 
            ainsi que les visuels sont fournis à titre purement indicatif et ne revêtent aucun caractère contractuel.
          </p>
          <p>
            SG MOTORS ne saurait être tenue pour responsable d&apos;une erreur matérielle évidente, d&apos;une omission involontaire ou de l&apos;indisponibilité 
            temporaire d&apos;un véhicule vendu entre-temps. L&apos;utilisateur est invité à vérifier l&apos;exactitude des informations d&apos;un véhicule 
            directement auprès de nos conseillers commerciaux avant tout engagement d&apos;achat.
          </p>
          <p>
            Le Site est accessible 24h/24, 7j/7, sous réserve des périodes de maintenance technique ou de pannes réseau. SG MOTORS décline 
            toute responsabilité en cas de dysfonctionnement du réseau Internet, d&apos;intrusions de tiers ou de virus sur le terminal de l&apos;utilisateur.
          </p>
        </div>
      ),
    },
    {
      id: "responsabilite-utilisateur",
      title: "5. Responsabilité de l'utilisateur",
      icon: <UserCheck className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            L&apos;utilisateur est responsable du bon fonctionnement de son équipement informatique et de sa connexion internet.
          </p>
          <p>
            Il s&apos;engage à utiliser le Site de bonne foi et conformément aux lois et règlements applicables. Notamment, lors de l&apos;utilisation 
            des formulaires de contact, d&apos;estimation de reprise ou de recherche personnalisée, l&apos;utilisateur s&apos;interdit de transmettre des informations 
            fausses, mensongères, diffamatoires ou portant atteinte à l&apos;ordre public.
          </p>
        </div>
      ),
    },
    {
      id: "loi-tribunal",
      title: "6. Modification et Loi applicable",
      icon: <Scale className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            SG MOTORS se réserve le droit de modifier les présentes CGU à tout moment afin de les adapter aux évolutions du Site 
            ou de la réglementation. Il est conseillé à l&apos;utilisateur de consulter régulièrement cette page.
          </p>
          <p>
            Les CGU sont régies et interprétées conformément à la législation française. Tout litige relatif à l&apos;utilisation du Site 
            qui ne pourrait être résolu à l&apos;amiable sera soumis à la compétence exclusive des <strong>tribunaux compétents de Marseille</strong>.
          </p>
        </div>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Conditions Générales d'Utilisation"
      subtitle="Règles de fonctionnement du site web et conditions de consultation de notre catalogue automobile."
      sections={sections}
    />
  );
}
