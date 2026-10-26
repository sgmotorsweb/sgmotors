"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { fetchServerSettings } from "@/lib/settings";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/acheter", label: "Acheter" },
  { href: "/vendre", label: "Vendre" },
  { href: "/recherche-personnalisee", label: "Recherche personnalisée" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    fetchServerSettings().then((s) => {
      if (s.phone) setPhone(s.phone.replace(/\s/g, ""));
    });
  }, [pathname]);

  // Le back-office a sa propre navigation.
  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="no-print sticky top-0 z-50 w-full border-b" style={{ backgroundColor: "rgba(255,255,255,0.96)", borderColor: "var(--border-primary)", backdropFilter: "blur(8px)" }}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-6">
        <Logo className="shrink-0" />

        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-[0.95rem] font-medium transition-colors hover:text-[var(--color-sg-accent-blue)] py-2"
              style={{ color: isActive(link.href) ? "var(--color-sg-accent-blue)" : "var(--text-primary)" }}
            >
              {link.label}
              {isActive(link.href) && <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 rounded-full" style={{ backgroundColor: "var(--color-sg-accent-blue)" }} />}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center">
          {phone && <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 px-6 py-3 text-white rounded-full text-sm font-semibold transition-opacity hover:opacity-90 shadow-md"
            style={{ backgroundColor: "var(--color-sg-accent-blue)" }}
          >
            <Phone className="h-4 w-4" />
            <span>Appel direct</span>
          </a>}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 transition-colors"
          style={{ color: "var(--text-primary)" }}
          aria-label="Menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-primary)" }}>
          <nav className="flex flex-col gap-2 pt-2 pb-6 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: isActive(link.href) ? "var(--color-sg-accent-blue)" : "var(--text-primary)",
                  borderBottom: "1px solid var(--border-primary)",
                }}
                className="text-base font-medium py-3 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {phone && <a
              href={`tel:${phone}`}
              className="mt-3 flex items-center justify-center gap-2 px-5 py-3 text-white rounded-full text-sm font-semibold"
              style={{ backgroundColor: "var(--color-sg-accent-blue)" }}
            >
              <Phone className="h-4 w-4" />
              Appel direct
            </a>}
          </nav>
        </div>
      )}
    </header>
  );
}
