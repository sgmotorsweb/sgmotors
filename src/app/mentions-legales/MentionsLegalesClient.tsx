"use client";

import { useEffect, useState } from "react";
import { Building, User, Server, Mail, ShieldAlert } from "lucide-react";
import { fetchServerSettings } from "@/lib/settings";
import LegalLayout from "@/components/LegalLayout";

export default function MentionsLegalesClient() {
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
      id: "editeur",
      title: "1. Éditeur du site",
      icon: <Building className="h-5 w-5" />,
      content: (
        <div className="space-y-3">
          <p>
            Le site internet <strong>sgmotors.fr</strong> (ci-après le « Site ») est édité par la société <strong>SG MOTORS</strong>, 
            Société à responsabilité limitée (Société à associé unique), au capital social de <strong>30 000,00 Euros</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Siège social :</strong> {settings.address}</li>
            <li><strong>Immatriculation :</strong> 106 519 630 R.C.S. Marseille</li>
            <li><strong>Date d&apos;immatriculation :</strong> 19/06/2026</li>
            <li><strong>Numéro d&apos;identification Européen (EUID) :</strong> FR1303.106519630</li>
            <li><strong>Numéro de TVA Intracommunautaire :</strong> FR65106519630</li>
          </ul>
        </div>
      ),
    },
    {
      id: "publication",
      title: "2. Direction de la publication",
      icon: <User className="h-5 w-5" />,
      content: (
        <p>
          Le directeur de la publication du Site est <strong>Monsieur Samuel GRAU</strong>, en sa qualité de Gérant de la société SG MOTORS.
        </p>
      ),
    },
    {
      id: "hebergeur",
      title: "3. Hébergement du site",
      icon: <Server className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            Le Site est hébergé par la société <strong>Vercel Inc.</strong> :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
            <li>Contact : support@vercel.com</li>
            <li>Site web : https://vercel.com</li>
          </ul>
        </div>
      ),
    },
    {
      id: "contact",
      title: "4. Contact",
      icon: <Mail className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            Pour toute question ou demande concernant le Site ou les services de SG MOTORS, vous pouvez contacter notre équipe :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {settings.phone && <li><strong>Téléphone :</strong> <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:underline text-[var(--color-sg-accent-blue)]">{settings.phone}</a></li>}
            {settings.email && <li><strong>E-mail :</strong> <a href={`mailto:${settings.email}`} className="hover:underline text-[var(--color-sg-accent-blue)]">{settings.email}</a></li>}
            <li><strong>Formulaire en ligne :</strong> Accessible directement sur notre page de <a href="/contact" className="hover:underline text-[var(--color-sg-accent-blue)]">Contact</a>.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "propriete",
      title: "5. Propriété intellectuelle",
      icon: <ShieldAlert className="h-5 w-5" />,
      content: (
        <div className="space-y-2">
          <p>
            L&apos;ensemble des éléments constituant ce Site (textes, graphismes, logiciels, photographies, images, vidéos, 
            sons, plans, logos, marques, créations et œuvres diverses protégées, etc.) ainsi que le Site lui-même, relèvent des législations 
            françaises et internationales sur le droit d&apos;auteur et la propriété intellectuelle.
          </p>
          <p>
            Ces éléments sont la propriété exclusive de la société SG MOTORS. À ce titre, toute reproduction, représentation, 
            adaptation, traduction et/ou transformation, partielle ou intégrale, ou transfert sur un autre site web, de tout element composant 
            le Site est strictement interdit sans l&apos;autorisation préalable et écrite de SG MOTORS.
          </p>
        </div>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Mentions Légales"
      subtitle="Informations légales obligatoires concernant l'éditeur et l'hébergeur du site."
      sections={sections}
    />
  );
}
