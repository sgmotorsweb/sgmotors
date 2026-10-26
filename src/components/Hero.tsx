import Image from "next/image";
import type { LucideIcon } from "lucide-react";

interface HeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  features: { icon: LucideIcon; label: string }[];
  image?: string;
  children?: React.ReactNode;
}

// Bandeau d'en-tête : texte à gauche, photo à droite fondue dans le blanc.
export default function Hero({ eyebrow, title, highlight, subtitle, features, image = "/hero-audi.jpg", children }: HeroProps) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
      <div className="relative h-56 sm:h-72 md:hidden">
        <Image src={image} alt="Véhicule SG MOTORS en showroom" fill priority className="object-cover object-[60%_center]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
      </div>

      <div className="hidden md:block absolute inset-y-0 right-0 w-[64%]">
        <Image src={image} alt="Véhicule SG MOTORS en showroom" fill priority className="object-cover object-center" sizes="64vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.85) 18%, rgba(255,255,255,0) 48%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 pt-2 pb-12 md:py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05]" style={{ color: "var(--text-primary)" }}>
            {title}<br />
            <span style={{ color: "var(--color-sg-accent-blue)" }}>{highlight}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
          <ul className="mt-8 flex flex-wrap gap-y-4">
            {features.map(({ icon: Icon, label }, i) => (
              <li key={label} className={`flex items-center gap-3 pr-4 mr-4 lg:pr-6 lg:mr-6 ${i < features.length - 1 ? "sm:border-r" : ""}`} style={{ borderColor: "var(--border-subtle)" }}>
                <Icon className="h-7 w-7 shrink-0" strokeWidth={1.75} style={{ color: "var(--color-sg-accent-blue)" }} />
                <span className="text-sm font-medium leading-tight max-w-[9rem]" style={{ color: "var(--text-primary)" }}>{label}</span>
              </li>
            ))}
          </ul>
          {children}
        </div>
      </div>
    </section>
  );
}
