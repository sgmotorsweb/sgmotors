"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Search, Edit, Trash2, Eye, X, Upload, Copy } from "lucide-react";
import Image from "next/image";
import type { VehicleData } from "@/lib/vehicles";
import { fetchVehicles, saveVehicle, deleteVehicle, updateVehicleStatus } from "@/lib/vehicles";
import { MAKES, getModelsForMake, ENERGY_TYPES, TRANSMISSION_TYPES, VEHICLE_TYPES, DOOR_COUNTS, SEAT_COUNTS, CONDITION_TYPES, CRIT_AIR_STICKERS } from "@/lib/cars-data";

const STATUSES = ["En ligne", "Brouillon", "En préparation", "Réservé", "Vendu"];
const BADGES = ["", "Coup de cœur", "Nouveau", "Exclusif"];

const StatutBadge = ({ status }: { status: string }) => {
  const c = ({ "En ligne": "green", "Réservé": "orange", "En préparation": "gray", "Vendu": "red" })[status] || "gray";
  return (<span className="px-2.5 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: `var(--color-${c}-100)`, color: `var(--color-${c}-600)`, borderColor: `var(--color-${c}-200)` }}>{status}</span>);
};

const Input = ({ label, val, onChange, placeholder, type = "text", required }: { label: string; val: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{label}{required && <span style={{ color: "var(--color-sg-accent-blue)" }}> *</span>}</label>
    <input type={type} value={val} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
      style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
  </div>
);

const Select = ({ label, val, onChange, options, required }: { label: string; val: string; onChange: (v: string) => void; options: string[]; required?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>{label}{required && <span style={{ color: "var(--color-sg-accent-blue)" }}> *</span>}</label>
    <select value={val} onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
      style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
      <option value="">Sélectionner...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

interface FormState {
  make: string; model: string; finition: string; year: string; firstRegDate: string; price: string; mileage: string;
  fuel: string; transmission: string; vehicleType: string; critAir: string; color: string; doors: string; seats: string;
  power: string; powerFiscal: string; consumption: string; co2: string; condition: string; badge: string; status: string;
  options: string; videoUrl: string;
  images: string[];
}

const emptyForm = (): FormState => ({
  make: "", model: "", finition: "", year: "", firstRegDate: "", price: "", mileage: "",
  fuel: "Essence", transmission: "Automatique", vehicleType: "Berline", critAir: "1", color: "", doors: "4", seats: "5",
  power: "", powerFiscal: "", consumption: "", co2: "", condition: "Bon état", badge: "", status: "En ligne",
  options: "", videoUrl: "", images: [],
});

export default function InventoryAdmin() {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tous les statuts");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<VehicleData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelsForMake = form.make ? getModelsForMake(form.make) : [];

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  const refreshVehicles = () => fetchVehicles().then(setVehicles);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    Promise.all(files.map((f) => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(f);
    }))).then((dataUrls) => {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...dataUrls] }));
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const makeModelOptions = (make: string) => {
    const models = getModelsForMake(make);
    if (models.length === 0) return MAKES;
    return models;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (v: VehicleData) => {
    setEditing(v);
    setForm({
      make: v.make, model: v.model, finition: v.finition || "", year: String(v.year), firstRegDate: v.firstRegDate || "",
      price: String(v.price), mileage: String(v.mileage), fuel: v.fuel, transmission: v.transmission,
      vehicleType: v.vehicleType || "", critAir: String(v.critAir), color: v.color, doors: String(v.doors), seats: String(v.seats),
      power: v.power, powerFiscal: v.powerFiscal || "", consumption: v.consumption, co2: v.co2, condition: v.condition || "",
      badge: v.badge || "", status: v.status || "En ligne",
      options: (v.options || []).join("\n"), videoUrl: v.videoUrl || "",
      images: v.images,
    });
    setShowModal(true);
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const handleSave = () => {
    if (!form.make.trim() || !form.model.trim() || !form.year || !form.price) return;
    const images = form.images.length > 0 ? form.images : ["https://images.unsplash.com/photo-1503376713581-7c0147cb2321?auto=format&fit=crop&q=80&w=1200"];
    const vehicle: VehicleData = {
      id: editing ? editing.id : String(Date.now()),
      make: form.make, model: form.model, finition: form.finition || undefined,
      year: Number(form.year), firstRegDate: form.firstRegDate || undefined,
      price: Number(form.price), mileage: Number(form.mileage) || 0,
      fuel: form.fuel, transmission: form.transmission, vehicleType: form.vehicleType || undefined,
      critAir: Number(form.critAir) || 1, color: form.color,
      doors: Number(form.doors) || 4, seats: Number(form.seats) || 5,
      power: form.power, powerFiscal: form.powerFiscal || undefined,
      consumption: form.consumption, co2: form.co2, condition: form.condition || undefined,
      options: form.options.split("\n").filter(Boolean),
      videoUrl: form.videoUrl || undefined,
      images, badge: form.badge || undefined, status: form.status, views: editing ? editing.views || 0 : 0,
    };
    saveVehicle(vehicle).then(refreshVehicles);
    setShowModal(false);
  };

  const handleDelete = (id: string) => { deleteVehicle(id).then(refreshVehicles); setShowDeleteConfirm(null); };

  const handleDuplicate = (v: VehicleData) => {
    setEditing(null);
    setForm({
      make: v.make, model: v.model, finition: v.finition || "", year: String(v.year), firstRegDate: v.firstRegDate || "",
      price: String(v.price), mileage: String(v.mileage), fuel: v.fuel, transmission: v.transmission,
      vehicleType: v.vehicleType || "", critAir: String(v.critAir), color: v.color, doors: String(v.doors), seats: String(v.seats),
      power: v.power, powerFiscal: v.powerFiscal || "", consumption: v.consumption, co2: v.co2, condition: v.condition || "",
      badge: v.badge || "", status: v.status || "En ligne",
      options: (v.options || []).join("\n"), videoUrl: v.videoUrl || "",
      images: v.images,
    });
    setShowModal(true);
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  const handleQuickStatus = (id: string, status: string) => {
    updateVehicleStatus(id, status).then(refreshVehicles);
  };

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (!q || `${v.make} ${v.model}`.toLowerCase().includes(q)) && (filterStatus === "Tous les statuts" || v.status === filterStatus);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Inventaire</h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Gérez vos véhicules (caractéristiques techniques, équipements).</p>
        </div>
        <button onClick={openAdd} className="text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
          <Plus className="h-5 w-5" /> Ajouter un véhicule
        </button>
      </div>

      <div className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "var(--text-muted)" }} />
          <input type="text" placeholder="Rechercher par marque, modèle..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
            style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition min-w-[150px]"
          style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
          <option>Tous les statuts</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ color: "var(--text-muted)" }}>
            <thead className="border-b" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
              <tr>
                <th className="px-6 py-4 font-medium">Véhicule</th>
                <th className="px-6 py-4 font-medium">Prix</th>
                <th className="px-6 py-4 font-medium">Km</th>
                <th className="px-6 py-4 font-medium">Année</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Vues</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-primary)" }}>
              {filtered.map((vehicle) => (
                <tr key={vehicle.id} className="transition-colors" style={{ backgroundColor: "var(--bg-card)" }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-16 rounded overflow-hidden">
                        <Image src={vehicle.images[0]} alt={vehicle.model} fill className="object-cover" sizes="64px" unoptimized />
                      </div>
                      <div>
                        <div className="font-bold" style={{ color: "var(--text-primary)" }}>{vehicle.make} {vehicle.model}</div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{vehicle.fuel} · {vehicle.transmission}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{vehicle.price.toLocaleString("fr-FR")} €</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{vehicle.mileage.toLocaleString("fr-FR")} km</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{vehicle.year}</td>
                  <td className="px-6 py-4">
                    <select value={vehicle.status || "En ligne"} onChange={(e) => handleQuickStatus(vehicle.id, e.target.value)}
                      className="text-xs font-medium rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none"
                      style={{
                        backgroundColor: `var(--color-${{ "En ligne": "green", "Réservé": "orange", "En préparation": "gray", Vendu: "red", Brouillon: "slate" }[vehicle.status || "En ligne"]}-100)`,
                        color: `var(--color-${{ "En ligne": "green", "Réservé": "orange", "En préparation": "gray", Vendu: "red", Brouillon: "slate" }[vehicle.status || "En ligne"]}-600)`,
                        borderColor: `var(--color-${{ "En ligne": "green", "Réservé": "orange", "En préparation": "gray", Vendu: "red", Brouillon: "slate" }[vehicle.status || "En ligne"]}-200)`,
                      }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center gap-1"><Eye className="h-4 w-4" style={{ color: "var(--text-muted)" }} />{vehicle.views || 0}</div></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(vehicle)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} title="Modifier"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDuplicate(vehicle)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} title="Dupliquer"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => setShowDeleteConfirm(vehicle.id)} className="p-2 rounded-lg transition-colors" style={{ color: "#ef4444" }} title="Supprimer"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (<tr><td colSpan={7} className="px-6 py-12 text-center" style={{ color: "var(--text-muted)" }}>Aucun véhicule trouvé</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-2xl p-8 max-w-4xl w-full shadow-2xl border my-8" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{editing ? "Modifier" : "Ajouter"} un véhicule</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-8">
              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Identification</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select label="Marque" val={form.make} onChange={(v) => setForm({ ...form, make: v, model: "" })} options={MAKES} required />
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Modèle *</label>
                    {modelsForMake.length > 0 ? (
                      <select value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                        className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                        style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                        <option value="">Sélectionner...</option>
                        {modelsForMake.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="Saisir le modèle"
                        className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                        style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                    )}
                  </div>
                  <Input label="Finition" val={form.finition} onChange={(v) => setForm({ ...form, finition: v })} placeholder="ex : Sport Chrono, Business" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Circulation & Prix</legend>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input label="Année *" val={form.year} onChange={(v) => setForm({ ...form, year: v })} type="number" placeholder="2024" required />
                  <Input label="Date 1ère mise en circulation" val={form.firstRegDate} onChange={(v) => setForm({ ...form, firstRegDate: v })} type="month" />
                  <Input label="Prix (€) *" val={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" placeholder="115000" required />
                  <Input label="Kilométrage" val={form.mileage} onChange={(v) => setForm({ ...form, mileage: v })} type="number" placeholder="24000" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Caractéristiques techniques</legend>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select label="Énergie" val={form.fuel} onChange={(v) => setForm({ ...form, fuel: v })} options={ENERGY_TYPES} />
                  <Select label="Boîte de vitesse" val={form.transmission} onChange={(v) => setForm({ ...form, transmission: v })} options={TRANSMISSION_TYPES} />
                  <Select label="Type de véhicule" val={form.vehicleType} onChange={(v) => setForm({ ...form, vehicleType: v })} options={VEHICLE_TYPES} />
                  <Select label="Crit'Air" val={form.critAir} onChange={(v) => setForm({ ...form, critAir: v })} options={CRIT_AIR_STICKERS.map((s) => s.split(" ")[0])} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <Select label="Portes" val={form.doors} onChange={(v) => setForm({ ...form, doors: v })} options={DOOR_COUNTS} />
                  <Select label="Places" val={form.seats} onChange={(v) => setForm({ ...form, seats: v })} options={SEAT_COUNTS} />
                  <Select label="État du véhicule" val={form.condition} onChange={(v) => setForm({ ...form, condition: v })} options={CONDITION_TYPES} />
                  <Input label="Couleur" val={form.color} onChange={(v) => setForm({ ...form, color: v })} placeholder="Gris GT" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Motorisation</legend>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input label="Puissance DIN" val={form.power} onChange={(v) => setForm({ ...form, power: v })} placeholder="450 ch" />
                  <Input label="Puissance fiscale (CV)" val={form.powerFiscal} onChange={(v) => setForm({ ...form, powerFiscal: v })} type="number" placeholder="22 CV" />
                  <Input label="Consommation" val={form.consumption} onChange={(v) => setForm({ ...form, consumption: v })} placeholder="10,2 L/100km" />
                  <Input label="CO₂ (g/km)" val={form.co2} onChange={(v) => setForm({ ...form, co2: v })} placeholder="234" />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Classification</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select label="Badge" val={form.badge} onChange={(v) => setForm({ ...form, badge: v })} options={["", "Coup de cœur", "Nouveau", "Exclusif"]} />
                  <Select label="Statut" val={form.status} onChange={(v) => setForm({ ...form, status: v })} options={STATUSES} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>Images</legend>
                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border group" style={{ borderColor: "var(--border-primary)" }}>
                      <Image src={img} alt={`${i + 1}`} fill className="object-cover" sizes="96px" unoptimized />
                      <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3 text-white" /></button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
                    <Upload className="h-6 w-6 mb-1" /><span className="text-[10px]">Ajouter</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                  Équipements <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>(une par ligne)</span>
                </legend>
                <textarea value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} rows={5}
                  placeholder="Pack Sport Chrono&#10;Toit ouvrant panoramique&#10;Échappement Sport"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition resize-none"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </fieldset>

              <fieldset>
                <legend className="text-base font-bold mb-4 pb-2 border-b w-full" style={{ color: "var(--text-primary)", borderColor: "var(--border-primary)" }}>
                  Vidéo
                </legend>
                <Input label="URL de la vidéo (YouTube/Vimeo)" val={form.videoUrl} onChange={(v) => setForm({ ...form, videoUrl: v })} placeholder="https://www.youtube.com/watch?v=..." />
              </fieldset>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl font-medium transition-colors" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>Annuler</button>
              <button onClick={handleSave} className="flex-1 py-3 text-white rounded-xl font-medium transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                {editing ? "Enregistrer" : "Ajouter le véhicule"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="rounded-2xl p-8 max-w-sm w-full shadow-2xl border text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="h-8 w-8 text-red-400" /></div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Confirmer la suppression</h2>
            <p className="mb-8" style={{ color: "var(--text-muted)" }}>Cette action est irréversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 border rounded-xl font-medium transition-colors" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>Annuler</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-3 text-white rounded-xl font-medium transition-colors" style={{ backgroundColor: "#ef4444" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
