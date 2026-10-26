"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, X, ChevronDown, ArrowRight, Mail } from "lucide-react";
import { fetchVehicles } from "@/lib/vehicles";
import type { VehicleData } from "@/lib/vehicles";
import VehicleCard, { isPublicVehicle } from "@/components/VehicleCard";

const KM_RANGES = [
  { label: "Kilométrage", max: Infinity },
  { label: "< 10 000 km", max: 10000 },
  { label: "< 20 000 km", max: 20000 },
  { label: "< 30 000 km", max: 30000 },
  { label: "< 50 000 km", max: 50000 },
  { label: "< 80 000 km", max: 80000 },
  { label: "< 100 000 km", max: 100000 },
  { label: "< 150 000 km", max: 150000 },
  { label: "< 200 000 km", max: 200000 },
];
const SORT_OPTIONS = [
  { label: "Plus récents", value: "recent" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Kilométrage croissant", value: "mileage_asc" },
];

type SortOption = "recent" | "price_asc" | "price_desc" | "mileage_asc";

const SelectBox = ({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
  <label className="block">
    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</span>
    <span className="relative block">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-3.5 pr-9 py-3 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition cursor-pointer"
        style={{ backgroundColor: "var(--bg-secondary)", borderColor: value ? "var(--color-sg-accent-blue)" : "var(--border-primary)", color: "var(--text-primary)" }}>
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
    </span>
  </label>
);

const uniqueSorted = (values: (string | undefined)[]) => Array.from(new Set(values.filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, "fr"));

export default function AcheterClient() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [kmLabel, setKmLabel] = useState("");
  const [sort, setSort] = useState<SortOption>("recent");

  useEffect(() => {
    fetchVehicles().then((all) => { setVehicles(all.filter(isPublicVehicle)); setLoaded(true); });
  }, []);

  const makes = useMemo(() => uniqueSorted(vehicles.map((v) => v.make)), [vehicles]);
  const models = useMemo(() => uniqueSorted(vehicles.filter((v) => !make || v.make === make).map((v) => v.model)), [make, vehicles]);
  const fuels = useMemo(() => uniqueSorted(vehicles.map((v) => v.fuel)), [vehicles]);
  const transmissions = useMemo(() => uniqueSorted(vehicles.map((v) => v.transmission)), [vehicles]);
  const kmMax = KM_RANGES.find((k) => k.label === kmLabel)?.max ?? Infinity;

  const hasFilters = !!(make || model || fuel || transmission || kmLabel);
  const clearFilters = () => { setMake(""); setModel(""); setFuel(""); setTransmission(""); setKmLabel(""); };

  const filtered = useMemo(() => {
    const results = vehicles.filter((v) =>
      (!make || v.make === make) &&
      (!model || v.model === model) &&
      (!fuel || v.fuel === fuel) &&
      (!transmission || v.transmission === transmission) &&
      v.mileage <= kmMax);
    if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
    else if (sort === "mileage_asc") results.sort((a, b) => a.mileage - b.mileage);
    // "recent" : l'API renvoie déjà les véhicules du plus récent au plus ancien.
    return results;
  }, [make, model, fuel, transmission, kmMax, sort, vehicles]);

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <section className="px-4 pt-12 pb-24 md:pb-28" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container mx-auto">
          <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>Acheter</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Nos véhicules disponibles</h1>
          <p className="mt-3 text-base max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>Des véhicules d&apos;occasion sélectionnés avec soin, contrôlés et prêts à prendre la route.</p>
        </div>
      </section>

      <section className="px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="container mx-auto">
          <div className="rounded-2xl border p-5 md:p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-lg)" }}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              <SelectBox label="Marque" value={make} onChange={(v) => { setMake(v); setModel(""); }}>
                <option value="">Toutes</option>
                {makes.map((m) => <option key={m} value={m}>{m}</option>)}
              </SelectBox>
              <SelectBox label="Modèle" value={model} onChange={setModel}>
                <option value="">Tous</option>
                {models.map((m) => <option key={m} value={m}>{m}</option>)}
              </SelectBox>
              <SelectBox label="Énergie" value={fuel} onChange={setFuel}>
                <option value="">Toutes</option>
                {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
              </SelectBox>
              <SelectBox label="Boîte" value={transmission} onChange={setTransmission}>
                <option value="">Toutes</option>
                {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
              </SelectBox>
              <SelectBox label="Kilométrage" value={kmLabel} onChange={setKmLabel}>
                <option value="">Tous</option>
                {KM_RANGES.slice(1).map((k) => <option key={k.label} value={k.label}>{k.label}</option>)}
              </SelectBox>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1 px-4 pt-10 pb-16">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {filtered.length} véhicule{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors hover:bg-[var(--hover-bg)]" style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}>
                  <X className="h-3 w-3" /> Effacer les filtres
                </button>
              )}
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
              Trier par
              <span className="relative">
                <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-8 py-2 border rounded-lg text-sm font-medium focus:outline-none cursor-pointer"
                  style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
              </span>
            </label>
          </div>

          {loaded && filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <Search className="h-12 w-12 mb-4" style={{ color: "var(--text-muted)" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Aucun véhicule ne correspond</h2>
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>Modifiez vos critères ou confiez-nous votre recherche.</p>
              {hasFilters && <button onClick={clearFilters} className="px-6 py-3 text-white rounded-full font-semibold" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Réinitialiser les filtres</button>}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="container mx-auto">
          <div className="rounded-3xl px-6 py-12 md:px-14 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left" style={{ backgroundColor: "var(--bg-dark)" }}>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Vous ne trouvez pas votre bonheur ?</h2>
              <p className="mt-2 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>Faites-nous part de votre souhait : nous trouvons le véhicule qui vous correspond.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/recherche-personnalisee" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-white rounded-full font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                Recherche personnalisée <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold border transition-colors hover:bg-white/10 text-white" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                <Mail className="h-4 w-4" /> Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
