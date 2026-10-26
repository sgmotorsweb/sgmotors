import Image from "next/image";
import Link from "next/link";

// Logo officiel : version sombre (fond clair) ou claire (fond sombre).
export function LogoImage({ variant = "dark", className = "h-14 w-auto" }: { variant?: "dark" | "light"; className?: string }) {
  return (
    <Image
      src={variant === "dark" ? "/logo-sgmotors.png" : "/logo-sgmotors-light.png"}
      alt="SG MOTORS — Conseil, achat, vente"
      width={1130}
      height={405}
      priority
      className={className}
    />
  );
}

export default function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label="SG MOTORS — Accueil" className={`inline-flex items-center ${className}`}>
      <LogoImage variant={variant} className="h-14 md:h-16 w-auto" />
    </Link>
  );
}
