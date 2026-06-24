"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Calendar, DollarSign, CreditCard, Truck, RotateCcw, ShieldCheck, HelpCircle } from "lucide-react";
import { fetchServerSettings } from "@/lib/settings";
import LegalLayout from "@/components/LegalLayout";

export default function CGV() {
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
      id: "champs-application",
      title: "1. Champ d'application",
      icon: <ShoppingBag className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l&apos;ensemble des relations contractuelles 
            entre la société <strong>SG MOTORS</strong>, Société à responsabilité limitée (Société à associé unique), au capital social de <strong>30 000,00 Euros</strong>, 
            immatriculée au Registre du Commerce et des Sociétés de Marseille sous le numéro <strong>106 519 630</strong> (ci-après « le Vendeur ») 
            et toute personne physique ou morale achetant un véhicule ou une prestation de services (ci-après « le Client »).
          </p>
          <p>
            Ces CGV s&apos;appliquent sans restriction aux activités d&apos;achat, de vente de véhicules terrestres à moteur neufs ou d&apos;occasion, 
            de dépôt-vente, d&apos;intermédiation commerciale, de location sans chauffeur de courte ou longue durée, et de vente de pièces détachées 
            et d&apos;accessoires automobiles.
          </p>
          <p>
            Toute signature d&apos;un bon de commande, d&apos;un mandat ou d&apos;un contrat de dépôt-vente implique l&apos;acceptation expresse et sans réserve des présentes CGV par le Client.
          </p>
        </div>
      ),
    },
    {
      id: "commande-reservation",
      title: "2. Commande et Réservation",
      icon: <Calendar className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            La commande ou la réservation d&apos;un véhicule devient définitive et ferme uniquement après :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>La signature d&apos;un bon de commande ou d&apos;un contrat de mandat écrit par le Client et un représentant de SG MOTORS.</li>
            <li>Le versement d&apos;un acompte ou d&apos;un versement de réservation (généralement fixé à 10% du prix TTC du véhicule, sauf accord contraire).</li>
          </ul>
          <p className="mt-2">
            En cas d&apos;annulation unilatérale de la commande par le Client (hors exercice d&apos;un droit de rétractation légal applicable), l&apos;acompte versé restera acquis à SG MOTORS à titre d&apos;indemnité contractuelle forfaitaire.
          </p>
        </div>
      ),
    },
    {
      id: "prix-tva",
      title: "3. Prix et Régime de TVA",
      icon: <DollarSign className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Les prix des véhicules présentés dans notre catalogue ou sur nos bons de commande sont indiqués en <strong>Euros</strong> et s&apos;entendent 
            <strong> toutes taxes comprises (TTC)</strong>.
          </p>
          <p>
            <strong>Éléments exclus du prix affiché :</strong> Les prix ne comprennent pas les frais d&apos;établissement du certificat d&apos;immatriculation 
            (carte grise, taxes régionales et éventuel malus ou écotaxe gouvernementale qui restent à la charge intégrale de l&apos;acheteur) ni les éventuels 
            frais facultatifs de mise à la route (préparation esthétique approfondie, plaques d&apos;immatriculation personnalisées, carburant de livraison).
          </p>
          <p>
            <strong>Régime de TVA applicable :</strong>
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pour les véhicules neufs ou éligibles, la TVA au taux standard en vigueur (20%) est facturée de manière classique et est récupérable pour les professionnels habilités.</li>
            <li>Pour la majorité des véhicules d&apos;occasion, les transactions sont soumises au régime particulier de la <strong>TVA sur la marge</strong> (Article 297 A du CGI). Dans ce cadre, aucune TVA n&apos;est apparente sur la facture de vente et celle-ci n&apos;est pas récupérable par l&apos;acquéreur.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "paiement",
      title: "4. Modalités de paiement",
      icon: <CreditCard className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            L&apos;intégralité du prix de vente (déduction faite de l&apos;acompte déjà versé) et des éventuels frais annexes doit être réglée et créditée 
            sur le compte bancaire de SG MOTORS avant la livraison ou l&apos;enlèvement effectif du véhicule.
          </p>
          <p>
            Les moyens de paiement acceptés sont les suivants :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Virement bancaire :</strong> Mode de paiement à privilégier. Le virement doit provenir d&apos;un établissement bancaire agréé et le montant doit être crédité sur le compte de SG MOTORS au moins 24 heures avant l&apos;enlèvement.</li>
            <li><strong>Chèque de banque :</strong> Uniquement les chèques émis par une banque française. Une copie du chèque doit être transmise à SG MOTORS au moins 48 heures ouvrées avant la livraison afin de permettre la vérification de son authenticité auprès de la banque émettrice.</li>
            <li><strong>Espèces :</strong> Uniquement pour les règlements ne dépassant pas le plafond légal en vigueur (soit un montant maximum de 1 000 Euros pour les particuliers domiciliés fiscalement en France).</li>
          </ul>
          <p className="mt-2 text-red-500/90 dark:text-red-400 font-semibold">
            Aucun véhicule ne sera remis au Client sans la confirmation définitive du paiement intégral.
          </p>
        </div>
      ),
    },
    {
      id: "livraison-risques",
      title: "5. Livraison et Transfert des risques",
      icon: <Truck className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            Sauf accord écrit particulier mentionné sur le bon de commande, la livraison s&apos;effectue par mise à disposition du véhicule directement 
            au sein de notre établissement principal situé à : <br />
            <strong>Actiburo 3 Bâtiment A, 100 Chemin de l&apos;Aumone-Vieille, 13400 Aubagne</strong>.
          </p>
          <p>
            Le transfert des risques (perte, vol, dégradations, contraventions) s&apos;opère au profit du Client au moment précis de la livraison effective 
            du véhicule, matérialisé par la remise des clés et la signature du procès-verbal de livraison ou du bon de livraison. Le Client s&apos;engage à 
            assurer le véhicule auprès d&apos;une compagnie d&apos;assurance à compter de cette date et heure exactes.
          </p>
        </div>
      ),
    },
    {
      id: "retractation",
      title: "6. Droit de rétractation",
      icon: <RotateCcw className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            <strong>Achat en établissement commercial physique (Garage à Aubagne) :</strong>
            Conformément aux dispositions du Code de la consommation, le consommateur qui achète un véhicule directement dans les locaux commerciaux 
            d&apos;un professionnel ne dispose pas d&apos;un droit de rétractation, sauf en cas de conclusion d&apos;un crédit affecté finançant l&apos;achat. Dans ce dernier 
            cas, le Client dispose d&apos;un droit de rétractation de 14 jours sur le crédit, ce qui entraîne automatiquement la résolution du contrat de vente du véhicule.
          </p>
          <p>
            <strong>Vente à distance ou hors établissement :</strong>
            Si le contrat de vente a été conclu exclusivement à distance (téléphone, e-mail, site internet avec paiement en ligne total sans visite préalable) 
            ou hors établissement au sens de l&apos;article L. 221-1 du Code de la consommation, le Client consommateur dispose d&apos;un délai légal de 
            <strong> 14 jours calendaires</strong> à compter du jour de la prise de possession du véhicule pour exercer son droit de rétractation.
          </p>
          <p>
            En cas d&apos;exercice de ce droit, les conditions suivantes s&apos;appliquent :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Les frais de retour du véhicule sont à la charge exclusive et intégrale du Client.</li>
            <li>Le véhicule doit être retourné en parfait état de fonctionnement, de propreté et de carrosserie, dans son état d&apos;origine.</li>
            <li>Le kilométrage parcouru depuis la livraison ne doit pas excéder 500 kilomètres. Tout kilomètre parcouru au-delà de cette limite sera facturé au Client au tarif de 1,00 € TTC par kilomètre.</li>
            <li>Aucune modification esthétique ou mécanique (ex: pose d&apos;accessoires, changement de pièces) ne doit avoir été effectuée.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "garanties",
      title: "7. Garanties légales et contractuelles",
      icon: <ShieldCheck className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Garantie Légale de Conformité (Code de la consommation) :</h4>
            <p>
              Conformément aux articles L. 217-3 et suivants du Code de la consommation, SG MOTORS garantit le consommateur contre les défauts de 
              conformité du véhicule existant lors de la livraison.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Le délai d&apos;action est de 2 ans à compter de la délivrance du véhicule.</li>
              <li>Pour les véhicules d&apos;occasion, les défauts qui apparaissent dans un délai de 12 mois à compter de la livraison sont présumés exister au moment de la livraison (charge de la preuve incombant au Vendeur).</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Garantie des Vices Cachés (Code civil) :</h4>
            <p>
              SG MOTORS est tenue de la garantie légale à raison des défauts cachés du véhicule vendu qui le rendent impropre à l&apos;usage auquel on 
              le destine, ou qui en diminuent tellement l&apos;usage que l&apos;acheteur ne l&apos;aurait pas acquis (Articles 1641 et suivants du Code civil). 
              L&apos;action doit être intentée dans un délai de 2 ans à compter de la découverte du vice.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>Garantie Commerciale / Contractuelle :</h4>
            <p>
              En complément des garanties légales, certains véhicules d&apos;occasion peuvent bénéficier d&apos;une garantie commerciale (couverture Moteur, Boîte, Pont, 
              ou garantie constructeur résiduelle). La durée (généralement 3, 6 ou 12 mois), l&apos;étendue géographique et les conditions d&apos;application exactes 
              sont détaillées sur le certificat de garantie remis au Client le jour de la vente.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "mediation-litiges",
      title: "8. Réclamations, Médiation et Juridiction",
      icon: <HelpCircle className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            En cas de réclamation ou de litige, le Client s&apos;engage à contacter en priorité le service commercial de SG MOTORS par e-mail à l&apos;adresse 
            <strong> {settings.email}</strong> ou par courrier postal au siège de l&apos;établissement afin de rechercher une solution amiable.
          </p>
          <p>
            <strong>Médiation :</strong> Conformément aux dispositions du Code de la consommation, le Client consommateur est informé qu&apos;il a la 
            possibilité de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable de tout différend persistant. 
            Le Client peut notamment saisir le médiateur de la branche professionnelle (ex: le Médiateur de Mobilians ou de la FNA).
          </p>
          <p>
            <strong>Juridiction compétente :</strong> 
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>En cas de litige avec un Client ayant la qualité de commerçant ou de professionnel, attribution de compétence exclusive est expressément faite au <strong>Tribunal des Activités Économiques / Tribunal de Commerce de Marseille</strong>.</li>
            <li>Pour les litiges avec des consommateurs, les règles de compétence légales de droit commun s&apos;appliquent.</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Conditions Générales de Vente"
      subtitle="Conditions contractuelles applicables à l'achat, la vente, la reprise et la location de véhicules chez SG MOTORS."
      sections={sections}
    />
  );
}

