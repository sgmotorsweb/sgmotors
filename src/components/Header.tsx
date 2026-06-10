"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { getSettings } from "@/lib/settings";

const navLinks = [
  { href: "/", label: "Catalogue" },
  { href: "/reprise", label: "Reprise" },
  { href: "/requete-recherche", label: "Requête de recherche" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Espace Pro" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const s = getSettings();
    if (s.phone) setPhone(s.phone.replace(/\s/g, ""));
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: "var(--bg-secondary)", boxShadow: "var(--shadow-sm)" }}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="SG MOTORS"
            width={160}
            height={60}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? "var(--color-sg-accent-blue)" : "var(--text-primary)",
              }}
              className="text-sm font-semibold transition-colors hover:text-[var(--color-sg-accent-blue)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)" }}
            aria-label="Changer le thème"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {phone && <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors shadow"
            style={{ backgroundColor: "var(--color-sg-accent-blue)" }}
          >
            <Phone className="h-4 w-4" />
            <span>Appel direct</span>
          </a>}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 transition-colors"
          style={{ color: "var(--text-primary)" }}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
          <nav className="flex flex-col gap-4 pt-4 pb-6 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: pathname === link.href ? "var(--color-sg-accent-blue)" : "var(--text-primary)",
                  borderBottom: "1px solid var(--border-primary)",
                }}
                className="text-sm font-semibold py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-2">
              <button
                onClick={toggleTheme}
                className="flex-1 py-3 rounded-lg text-sm font-semibold transition-colors"
                style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-tertiary)" }}
              >
                {theme === "dark" ? "Mode clair" : "Mode sombre"}
              </button>
              {phone && <a
                href={`tel:${phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-sg-accent-blue)] text-white rounded-lg text-sm font-semibold"
              >
                <Phone className="h-4 w-4" />
                Appel direct
              </a>}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
