"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sgmotors_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("sgmotors_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("sgmotors_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 shadow-2xl" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>Votre vie privée est importante pour nous</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nous utilisons des cookies pour améliorer votre expérience sur notre site, analyser le trafic et personnaliser le contenu. 
            Vous pouvez consulter notre <Link href="/rgpd" className="hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>Politique de confidentialité</Link>.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={declineCookies}
            className="flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: "1px solid var(--border-subtle)", color: "var(--text-primary)", backgroundColor: "transparent" }}
          >
            Refuser
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2 text-white rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--color-sg-accent-blue)" }}
          >
            Accepter tout
          </button>
        </div>
      </div>
    </div>
  );
}
