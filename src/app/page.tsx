"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Gauge, Fuel, Cog, X, ArrowRight, ChevronDown, SlidersHorizontal, ChevronUp } from "lucide-react";
import { getVehicles } from "@/lib/vehicles";
import type { VehicleData } from "@/lib/vehicles";

const PRICE_MIN = 0;
const PRICE_MAX = 200000;
const currentYear = new Date().getFullYear();
const YEARS = ["Toutes années", ...Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i))];
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
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Kilométrage", value: "mileage_asc" },
  { label: "Plus récent", value: "year_desc" },
];

type SortOption = "price_asc" | "price_desc" | "mileage_asc" | "year_desc";

const SelectBox = ({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none pl-3 pr-8 py-2.5 border rounded-lg text-sm focus:outline-none transition cursor-pointer"
      style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
  </div>
);

export default function CataloguePage() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [kmRange, setKmRange] = useState(KM_RANGES[0]);
  const [year, setYear] = useState("");
  const [sort, setSort] = useState<SortOption>("price_asc");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setVehicles(getVehicles());
  }, []);

  const MAKES = ["", ...Array.from(new Set(vehicles.map((v) => v.make))).sort()];
  const TRANSMISSIONS = ["", ...Array.from(new Set(vehicles.map((v) => v.transmission))).sort()];

  const availableModels = useMemo(() => {
    const models = vehicles.filter((v) => make === "Toutes marques" || v.make === make).map((v) => v.model);
    return ["", ...Array.from(new Set(models)).sort()];
  }, [make, vehicles]);

  const handleMakeChange = (val: string) => { setMake(val); setModel(""); };

  const activeFilterCount = [!!make, !!model, !!transmission, priceMin > PRICE_MIN || priceMax < PRICE_MAX, kmRange.label !== "Kilométrage", !!year].filter(Boolean).length;

  const clearFilters = () => { setSearch(""); setMake(""); setModel(""); setTransmission(""); setPriceMin(PRICE_MIN); setPriceMax(PRICE_MAX); setKmRange(KM_RANGES[0]); setYear(""); setSort("price_asc"); };

  const filtered = useMemo(() => {
    let results = vehicles.filter((v) => {
      const q = search.toLowerCase();
      return (!q || `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(q)) &&
        (!make || v.make === make) &&
        (!model || v.model === model) &&
        (!transmission || v.transmission === transmission) &&
        v.price >= priceMin && v.price <= priceMax &&
        v.mileage <= kmRange.max &&
        (!year || String(v.year) === year);
    });
    results.sort((a, b) => { if (sort === "price_asc") return a.price - b.price; if (sort === "price_desc") return b.price - a.price; if (sort === "mileage_asc") return a.mileage - b.mileage; return b.year - a.year; });
    return results;
  }, [search, make, model, transmission, priceMin, priceMax, kmRange, year, sort, vehicles]);

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-10" style={{ backgroundColor: "var(--gradient-from)", borderColor: "var(--border-primary)" }}>
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-1" style={{ color: "var(--text-primary)" }}>Notre Catalogue</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} véhicule{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="sticky top-20 z-40 border-b shadow-lg" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-primary)" }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input type="text" placeholder="Rechercher…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition"
                style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2.5 border rounded-lg text-sm focus:outline-none transition cursor-pointer"
                style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 text-xs px-3 py-2.5 rounded-lg transition-colors border" style={{ color: "var(--text-secondary)", borderColor: "var(--border-primary)" }}>
              <SlidersHorizontal className="h-4 w-4" /> Filtres {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors" style={{ color: "var(--text-muted)", border: "1px solid var(--border-primary)" }}>
                <X className="h-3 w-3" /> Effacer
              </button>
            )}
          </div>
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3 pt-3 border-t" style={{ borderColor: "var(--border-primary)" }}>
              <SelectBox value={make} onChange={handleMakeChange}>{MAKES.map((m) => <option key={m} value={m}>{m || "Marques"}</option>)}</SelectBox>
              <SelectBox value={model} onChange={setModel}>{availableModels.map((m) => <option key={m} value={m}>{m || "Modèles"}</option>)}</SelectBox>
              <div>
                <input type="number" min={PRICE_MIN} max={priceMax} value={priceMin}
                  onChange={(e) => setPriceMin(Math.max(PRICE_MIN, Math.min(Number(e.target.value) || 0, priceMax)))}
                  placeholder="Prix minimum"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition mb-1.5"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                <input type="number" min={priceMin} max={PRICE_MAX} value={priceMax}
                  onChange={(e) => setPriceMax(Math.max(Number(e.target.value) || 0, priceMin))}
                  placeholder="Prix maximum"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <SelectBox value={kmRange.label} onChange={(v) => setKmRange(KM_RANGES.find((k) => k.label === v) || KM_RANGES[0])}>{KM_RANGES.map((k) => <option key={k.label} value={k.label}>{k.label}</option>)}</SelectBox>
              <SelectBox value={transmission} onChange={setTransmission}>{TRANSMISSIONS.map((t) => <option key={t} value={t}>{t || "Boîtes"}</option>)}</SelectBox>
              <SelectBox value={year} onChange={setYear}>{YEARS.map((y) => <option key={y} value={y}>{y || "Année"}</option>)}</SelectBox>
            </div>
          )}
        </div>
      </div>

      <section className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Search className="h-16 w-16 mb-4" style={{ color: "var(--text-muted)" }} />
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Aucun véhicule trouvé</h2>
              <p className="mb-6" style={{ color: "var(--text-muted)" }}>Essayez de modifier vos critères de recherche.</p>
              <button onClick={clearFilters} className="px-6 py-3 text-white rounded-lg font-semibold transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Réinitialiser les filtres</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((vehicle) => (
                <Link key={vehicle.id} href={`/vehicule/${vehicle.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model} - ${vehicle.year}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                      <span className="px-2 py-1 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>{vehicle.year}</span>
                      {vehicle.badge && <span className="px-2 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>{vehicle.badge}</span>}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold mb-1 transition-colors" style={{ color: "var(--text-primary)" }}>{vehicle.make} {vehicle.model}</h3>
                    <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                      <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{vehicle.mileage.toLocaleString("fr-FR")} km</span>
                      <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{vehicle.fuel}</span>
                      <span className="flex items-center gap-1"><Cog className="h-3 w-3" />{vehicle.transmission}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
                      <div className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>{vehicle.price.toLocaleString("fr-FR")} €</div>
                      <span className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: "var(--color-sg-accent-blue)" }}>Voir <ArrowRight className="h-3 w-3" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t py-14 px-4" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Vous souhaitez vendre ou faire reprendre votre véhicule ?</h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>Obtenez une estimation gratuite et sans engagement en quelques minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reprise" className="px-8 py-4 text-white rounded-xl font-bold transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Faire estimer mon véhicule</Link>
            <Link href="/contact" className="px-8 py-4 border rounded-xl font-bold transition-colors" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>Nous contacter</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
