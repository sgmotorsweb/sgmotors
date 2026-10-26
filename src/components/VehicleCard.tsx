import Image from "next/image";
import Link from "next/link";
import { Gauge, Fuel, Cog, Calendar, ArrowRight } from "lucide-react";
import type { VehicleData } from "@/lib/vehicles";

// Statuts qui ne doivent pas apparaître sur le site public.
const HIDDEN_STATUSES = ["Brouillon", "En préparation"];

export function isPublicVehicle(v: VehicleData) {
  return !HIDDEN_STATUSES.includes(v.status || "En ligne");
}

export default function VehicleCard({ vehicle }: { vehicle: VehicleData }) {
  const statusTag = vehicle.status === "Réservé" || vehicle.status === "Vendu" ? vehicle.status : null;
  return (
    <Link href={`/vehicule/${vehicle.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-sm)" }}>
      <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        <Image src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model} - ${vehicle.year}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {vehicle.badge && <span className="px-3 py-1 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>{vehicle.badge}</span>}
          {statusTag && <span className="px-3 py-1 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: "var(--bg-dark)" }}>{statusTag}</span>}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{vehicle.make} {vehicle.model}</h3>
        <p className="text-sm mb-3 truncate" style={{ color: "var(--text-muted)" }}>{vehicle.finition || " "}</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" style={{ color: "var(--color-sg-accent-blue)" }} />{vehicle.year}</span>
          <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5" style={{ color: "var(--color-sg-accent-blue)" }} />{vehicle.mileage.toLocaleString("fr-FR")} km</span>
          <span className="flex items-center gap-1.5"><Fuel className="h-3.5 w-3.5" style={{ color: "var(--color-sg-accent-blue)" }} />{vehicle.fuel}</span>
          <span className="flex items-center gap-1.5"><Cog className="h-3.5 w-3.5" style={{ color: "var(--color-sg-accent-blue)" }} />{vehicle.transmission}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
          <div className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>{vehicle.price.toLocaleString("fr-FR")} €</div>
          <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--color-sg-accent-blue)" }}>Voir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  );
}
