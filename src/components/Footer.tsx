"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Car, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import type { AppSettings } from "@/lib/settings";
import { getSettings } from "@/lib/settings";

const IconInstagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const IconYoutube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const IconTiktok = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const IconTwitter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

const IconLinkedin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconSnapchat = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 2a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8l-1 3 3-1.5c1 .3 2 .5 3 .5s2-.2 3-.5L17 22l-1-3c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" />
  </svg>
);

const IconPinterest = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <path d="M12 2a10 10 0 0 0-3.5 19.3c-.1-.8-.2-2 .04-2.7l1.5-6.4s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 .9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.5 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8-3 0-4.8 2.2-4.8 4.7 0 .9.3 1.8.7 2.3.2.2.2.5.1.7l-.3 1c-.1.4-.4.5-.8.3-1.2-.5-2-2.6-2-4 0-2.9 2.5-6.4 7.4-6.4 3.9 0 6.5 2.8 6.5 5.8 0 3.9-2.2 6.8-5.4 6.8-1.1 0-2.1-.6-2.4-1.3l-.7 2.6c-.2 1-.9 2.1-1.3 2.8A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" />
  </svg>
);

export default function Footer() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSettings(getSettings());
  }, [pathname]);

  const s = settings || {
    facebook: "", instagram: "", youtube: "", tiktok: "", twitter: "",
    linkedin: "", snapchat: "", pinterest: "", whatsapp: "",
    phone: "", email: "", address: "",
  } as AppSettings;

  const socialLinks = [
    { url: s.instagram, label: "Instagram", icon: IconInstagram },
    { url: s.facebook, label: "Facebook", icon: IconFacebook },
    { url: s.youtube, label: "YouTube", icon: IconYoutube },
    { url: s.tiktok, label: "TikTok", icon: IconTiktok },
    { url: s.twitter, label: "Twitter / X", icon: IconTwitter },
    { url: s.linkedin, label: "LinkedIn", icon: IconLinkedin },
    { url: s.snapchat, label: "Snapchat", icon: IconSnapchat },
    { url: s.pinterest, label: "Pinterest", icon: IconPinterest },
  ];

  return (
    <footer style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6" style={{ color: "var(--text-primary)" }}>
              <Car className="h-6 w-6" style={{ color: "var(--color-sg-accent-blue)" }} />
              <span className="font-bold text-2xl tracking-tight">SG MOTORS</span>
            </Link>
            <p style={{ color: "var(--text-muted)" }} className="text-sm mb-6">
              L&apos;excellence automobile au service de votre passion. Conseil, achat et vente de véhicules premium et sportifs.
            </p>
            <div className="flex gap-4">
              {socialLinks.filter((l) => l.url).map((l) => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.label} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
                  <l.icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Liens Rapides</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Catalogue de véhicules</Link></li>
              <li><Link href="/requete-recherche" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Requête de recherche</Link></li>
              <li><Link href="/reprise" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Estimer ma voiture</Link></li>
              <li><Link href="/contact" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Nous contacter</Link></li>
              <li><Link href="/admin" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Espace Pro</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Informations Légales</h4>
            <ul className="space-y-3">
              <li><Link href="/mentions-legales" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Mentions Légales</Link></li>
              <li><Link href="/cgu" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>CGU</Link></li>
              <li><Link href="/cgv" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>CGV</Link></li>
              <li><Link href="/rgpd" className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>Politique de Confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Contactez-nous</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--color-sg-accent-blue)" }} />
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{s.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" style={{ color: "var(--color-sg-accent-blue)" }} />
                <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>{s.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" style={{ color: "var(--color-sg-accent-blue)" }} />
                <a href={`mailto:${s.email}`} className="text-sm transition-colors" style={{ color: "var(--text-muted)" }}>{s.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--border-primary)" }}>
          <p className="text-sm text-center md:text-left" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} SG MOTORS. Tous droits réservés.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <Link href="/mentions-legales" className="transition-colors" style={{ color: "var(--text-muted)" }}>Mentions légales</Link>
            <Link href="/rgpd" className="transition-colors" style={{ color: "var(--text-muted)" }}>RGPD</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
