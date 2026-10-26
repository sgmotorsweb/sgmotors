import Link from "next/link";

export default function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  const motorsColor = variant === "dark" ? "var(--text-primary)" : "#ffffff";
  const taglineColor = variant === "dark" ? "var(--text-muted)" : "rgba(255,255,255,0.6)";
  return (
    <Link href="/" aria-label="SG MOTORS — Accueil" className={`inline-flex flex-col items-end leading-none select-none ${className}`}>
      <span className="font-logo font-extrabold italic tracking-tight text-[1.65rem] md:text-[1.9rem]">
        <span style={{ color: "var(--color-sg-accent-blue)" }}>SG</span>
        <span className="ml-2" style={{ color: motorsColor }}>MOTORS</span>
      </span>
      <span className="mt-1 text-[0.55rem] md:text-[0.6rem] font-semibold uppercase tracking-[0.28em]" style={{ color: taglineColor }}>
        Automobiles d&apos;occasion
      </span>
    </Link>
  );
}
