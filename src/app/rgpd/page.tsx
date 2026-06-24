"use client";

import { useEffect, useState } from "react";
import { Shield, List, Eye, Users, Clock, Lock } from "lucide-react";
import { fetchServerSettings } from "@/lib/settings";
import LegalLayout from "@/components/LegalLayout";

export default function RGPD() {
  const [settings, setSettings] = useState({ phone: "", email: "", address: "" });

  useEffect(() => {
    fetchServerSettings().then((s) => {
      setSettings({
        phone: s.phone || "",
        email: s.email || "",
        address: s.address || "Actiburo 3 Bâtiment A, 100 Chemin de l'Aumone-Vieille, 13400 Aubagne",
      });
    });
  }, []);

  const sections = [
    {
      id: "introduction-responsable",
      title: "1. Introduction et Responsable du traitement",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            La société <strong>SG MOTORS</strong> attache une importance primordiale à la protection de la vie privée et des données 
            personnelles de ses clients, prospects et utilisateurs de son Site internet <strong>sgmotors.fr</strong>.
          </p>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD n° 2016/679) et à la loi française « Informatique et Libertés » 
            du 6 janvier 1978 modifiée, les données sont collectées de manière transparente, légitime et sécurisée.
          </p>
          <p>
            <strong>Identité du Responsable du traitement :</strong> <br />
            La société <strong>SG MOTORS</strong>, SARL au capital de 30 000,00 €, RCS Marseille 106 519 630, ayant son siège à 
            Actiburo 3 Bâtiment A, 100 Chemin de l&apos;Aumone-Vieille, 13400 Aubagne, France. <br />
            Représentant légal et Délégué à la Protection des Données (DPO) : <strong>Monsieur Samuel GRAU</strong>.
          </p>
        </div>
      ),
    },
    {
      id: "donnees-collectees",
      title: "2. Données personnelles collectées",
      icon: <List className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Nous collectons uniquement les données strictement nécessaires aux finalités poursuivies. Ces données nous sont transmises 
            directement par vous-même via les différents formulaires du Site :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Formulaire de Contact :</strong> Nom, prénom, adresse e-mail, numéro de téléphone, sujet et contenu du message.</li>
            <li><strong>Demande de Reprise / Estimation :</strong> Nom, prénom, e-mail, téléphone, ainsi que les caractéristiques techniques du véhicule destiné à la reprise (numéro d&apos;immatriculation, marque, modèle, kilométrage, état mécanique, options et photographies du véhicule).</li>
            <li><strong>Formulaire de Requête de Recherche :</strong> Critères de recherche du véhicule souhaité (marque, modèle, budget maximum, carburant, kilométrage max, type de boîte de vitesses), coordonnées de contact.</li>
            <li><strong>Alerte véhicule :</strong> Adresse e-mail de l&apos;utilisateur et critères de recherche associés.</li>
            <li><strong>Données de connexion et navigation :</strong> Adresse IP, cookies de session et statistiques de fréquentation (via le consentement géré par notre bannière de cookies).</li>
          </ul>
        </div>
      ),
    },
    {
      id: "finalites-bases",
      title: "3. Finalités et Bases légales du traitement",
      icon: <Eye className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Vos données personnelles sont collectées et traitées pour les finalités suivantes :
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-[var(--border-primary)]" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-tertiary)" }}>
                  <th className="p-3 text-left font-bold" style={{ color: "var(--text-primary)" }}>Finalité du traitement</th>
                  <th className="p-3 text-left font-bold" style={{ color: "var(--text-primary)" }}>Base légale</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <td className="p-3">Réponse aux demandes de contact, de devis et d&apos;informations commerciales.</td>
                  <td className="p-3">Exécution de mesures précontractuelles.</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <td className="p-3">Établissement d&apos;estimations de valeur pour la reprise commerciale de votre ancien véhicule.</td>
                  <td className="p-3">Exécution de mesures précontractuelles.</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <td className="p-3">Gestion des alertes de recherche et alertes de stock.</td>
                  <td className="p-3">Consentement de l&apos;utilisateur.</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <td className="p-3">Réalisation des démarches officielles d&apos;immatriculation auprès du SIV (Système d&apos;Immatriculation des Véhicules).</td>
                  <td className="p-3">Exécution d&apos;un mandat d&apos;immatriculation.</td>
                </tr>
                <tr className="border-b" style={{ borderColor: "var(--border-primary)" }}>
                  <td className="p-3">Gestion administrative des ventes, facturation et comptabilité.</td>
                  <td className="p-3">Exécution d&apos;un contrat et obligations légales.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    {
      id: "destinataires",
      title: "4. Destinataires des données",
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Les données personnelles traitées par SG MOTORS sont strictement confidentielles. Elles ne font l&apos;objet d&apos;aucune vente, 
            cession ou location à des tiers à des fins commerciales.
          </p>
          <p>
            Les seuls destinataires de vos données sont :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Le personnel habilité de la société SG MOTORS (conseillers commerciaux, service administratif).</li>
            <li>Nos sous-traitants techniques indispensables au fonctionnement du Site (hébergeur, services d&apos;envoi de courriels).</li>
            <li>Les administrations publiques compétentes (Ministère de l&apos;Intérieur, SIV) dans le cadre exclusif de la réalisation des démarches de demande de carte grise et d&apos;immatriculation des véhicules.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "conservation",
      title: "5. Durée de conservation des données",
      icon: <Clock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Nous conservons vos données personnelles uniquement pendant la durée nécessaire à l&apos;accomplissement des finalités pour lesquelles 
            elles ont été collectées, conformément à la réglementation en vigueur :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Données des prospects / contacts :</strong> Conservées pendant un délai maximal de <strong>3 ans</strong> à compter du dernier contact actif initié par le prospect (par exemple, une demande de contact ou une estimation).</li>
            <li><strong>Données des clients (ventes, mandats, facturation) :</strong> Conservées pendant la durée de la relation contractuelle, puis conservées en archivage intermédiaire pendant <strong>10 ans</strong> pour répondre à nos obligations légales comptables et fiscales (Code de commerce).</li>
            <li><strong>Cookies et données de connexion :</strong> Conservés pendant une durée maximale de <strong>13 mois</strong>.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "droits-utilisateurs",
      title: "6. Vos Droits et recours",
      icon: <Lock className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Conformément à la réglementation applicable, vous disposez des droits suivants sur vos données personnelles :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Droit d&apos;accès :</strong> Obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
            <li><strong>Droit de rectification :</strong> Demander la correction de données inexactes, incomplètes ou obsolètes.</li>
            <li><strong>Droit à l&apos;effacement (droit à l&apos;oubli) :</strong> Demander la suppression de vos données personnelles sous réserve de motifs légitimes.</li>
            <li><strong>Droit à la limitation du traitement :</strong> Demander le gel temporaire du traitement de vos données.</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et couramment utilisé pour les transmettre à un autre responsable.</li>
            <li><strong>Droit d&apos;opposition :</strong> Vous opposer à tout moment au traitement de vos données pour des raisons tenant à votre situation particulière, ou à leur utilisation à des fins de prospection commerciale.</li>
          </ul>
          <p className="mt-4">
            Pour exercer ces droits, il vous suffit d&apos;adresser votre demande par e-mail à l&apos;adresse suivante : 
            <strong> {settings.email}</strong>, ou par courrier postal signé accompagné de la copie d&apos;une pièce d&apos;identité à l&apos;adresse du siège social de SG MOTORS.
          </p>
          <p>
            Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès 
            de la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) sur leur site internet : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="hover:underline text-[var(--color-sg-accent-blue)]">www.cnil.fr</a>.
          </p>
        </div>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Politique de Confidentialité (RGPD)"
      subtitle="Comment nous protégeons, collectons et traitons vos données personnelles dans le respect de la législation RGPD."
      sections={sections}
    />
  );
}

