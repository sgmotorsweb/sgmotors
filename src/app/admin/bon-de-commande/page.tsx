"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileSignature, ImagePlus, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";
import { fetchVehicles, type VehicleData } from "@/lib/vehicles";
import { fetchServerSettings, type AppSettings } from "@/lib/settings";

const DRAFT_KEY = "sgmotors_bon_commande_draft";

type Fields = Record<string, string>;
interface PriceLine { id: string; label: string; amount: string; }
type DeliveryMode = "date" | "semaine" | "fourchette" | "mois";

interface OrderState {
  fields: Fields;
  lines: PriceLine[];
  deliveryMode: DeliveryMode;
  isNew: boolean;
  image: string;
}

const DEFAULT_CONDITIONS =
  "Le présent bon de commande vaut engagement ferme de l'acheteur dès sa signature. Le prix indiqué est ferme et non révisable. " +
  "Le transfert de propriété intervient au complet paiement du prix. Le véhicule est livré avec ses documents administratifs " +
  "(certificat d'immatriculation, certificat de cession, contrôle technique de moins de 6 mois le cas échéant). " +
  "Les conditions générales de vente de SG MOTORS s'appliquent.";

const uid = () => Math.random().toString(36).slice(2, 9);

const today = () => new Date().toISOString().slice(0, 10);

const newOrderNumber = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `BC-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
};

const emptyOrder = (): OrderState => ({
  fields: { numero: newOrderNumber(), date: today(), conditions: DEFAULT_CONDITIONS, garantie: "12 mois", paiement: "Virement bancaire", lieuLivraison: "SG MOTORS — Aubagne" },
  lines: [
    { id: uid(), label: "Prix du véhicule TTC", amount: "" },
    { id: uid(), label: "Frais de mise à la route", amount: "" },
    { id: uid(), label: "Frais de livraison", amount: "" },
    { id: uid(), label: "Plaques d'immatriculation", amount: "" },
    { id: uid(), label: "Certificat d'immatriculation (carte grise)", amount: "" },
  ],
  deliveryMode: "date",
  isNew: false,
  image: "",
});

const toNumber = (v: string) => Number(String(v).replace(/\s/g, "").replace(",", ".")) || 0;
const euros = (n: number) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
const formatDateFr = (iso: string) => (iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("fr-FR") : "");

export default function BonDeCommandePage() {
  const [order, setOrder] = useState<OrderState>(emptyOrder);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loaded, setLoaded] = useState(false);
  const imageInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVehicles().then(setVehicles);
    fetchServerSettings().then(setSettings);
    // Le brouillon n'est lisible qu'après le montage (localStorage indisponible côté serveur).
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) setOrder({ ...emptyOrder(), ...JSON.parse(draft) });
    } catch {}
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Brouillon conservé dans ce navigateur (la photo n'est gardée que si elle tient dans le stockage).
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(order)); }
    catch { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...order, image: "" })); } catch {} }
  }, [order, loaded]);

  const f = order.fields;
  const set = (key: string, value: string) => setOrder((o) => ({ ...o, fields: { ...o.fields, [key]: value } }));
  const setLine = (id: string, patch: Partial<PriceLine>) => setOrder((o) => ({ ...o, lines: o.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const total = useMemo(() => order.lines.reduce((s, l) => s + toNumber(l.amount), 0) - toNumber(f.remise || "") - toNumber(f.reprise || ""), [order.lines, f.remise, f.reprise]);
  const resteAPayer = total - toNumber(f.acompte || "");

  const fillFromVehicle = (id: string) => {
    const v = vehicles.find((x) => x.id === id);
    if (!v) return;
    setOrder((o) => ({
      ...o,
      image: v.images?.[0] || o.image,
      isNew: v.mileage === 0,
      fields: {
        ...o.fields,
        marque: v.make, modele: v.model, finition: v.finition || "",
        motorisation: [v.power && (/^\d+$/.test(v.power) ? `${v.power} ch` : v.power), v.fuel].filter(Boolean).join(" — "),
        energie: v.fuel, boite: v.transmission, type: v.vehicleType || "", couleur: v.color || "",
        portes: v.doors ? String(v.doors) : "", puissance: v.power ? (/^\d+$/.test(v.power) ? `${v.power} ch` : v.power) : "",
        puissanceFiscale: v.powerFiscal || "", co2: v.co2 || "", kilometrage: String(v.mileage ?? ""),
        miseEnCirculation: v.firstRegDate ? (v.firstRegDate.length === 7 ? `${v.firstRegDate}-01` : v.firstRegDate) : "",
      },
      lines: o.lines.map((l, i) => (i === 0 ? { ...l, amount: String(v.price) } : l)),
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setOrder((o) => ({ ...o, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const reset = () => {
    if (!window.confirm("Effacer ce bon de commande et en commencer un nouveau ?")) return;
    setOrder(emptyOrder());
  };

  const deliveryText = () => {
    switch (order.deliveryMode) {
      case "date": return f.livraisonDate ? `Le ${formatDateFr(f.livraisonDate)}` : "";
      case "semaine": return f.livraisonSemaine ? `Semaine ${f.livraisonSemaine}${f.livraisonAnnee ? ` de ${f.livraisonAnnee}` : ""}` : "";
      case "fourchette": return f.livraisonDu || f.livraisonAu ? `Entre le ${formatDateFr(f.livraisonDu)} et le ${formatDateFr(f.livraisonAu)}` : "";
      case "mois": return f.livraisonMois ? `${f.livraisonMois} mois à partir de la signature du bon de commande` : "";
    }
  };

  const fp = (name: string) => ({ value: f[name] || "", onChange: (v: string) => set(name, v) });

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <FileSignature className="h-7 w-7" style={{ color: "var(--color-sg-accent-blue)" }} /> Bon de commande
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Complétez les cases puis imprimez ou enregistrez en PDF. Le brouillon est conservé sur cet appareil.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select defaultValue="" onChange={(e) => { fillFromVehicle(e.target.value); e.target.value = ""; }}
            className="border rounded-lg px-3 py-2 text-sm max-w-[260px]" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
            <option value="" disabled>Pré-remplir depuis l&apos;inventaire…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} {v.finition || ""} — {v.price.toLocaleString("fr-FR")} €</option>)}
          </select>
          <button onClick={reset} className="px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>
            <RotateCcw className="h-4 w-4" /> Nouveau
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
            <Printer className="h-4 w-4" /> Imprimer / PDF
          </button>
        </div>
      </div>

      <style>{`@media print { @page { size: A4; margin: 10mm; } }`}</style>

      <article className="bon-commande mx-auto w-full max-w-[210mm] bg-white text-slate-900 shadow-xl print:shadow-none rounded-sm px-[12mm] py-[12mm] print:p-0 text-[13px] leading-snug">
        {/* En-tête */}
        <header className="flex justify-between items-start gap-6 pb-5 border-b-2" style={{ borderColor: "var(--color-sg-accent-blue)" }}>
          <div>
            <p className="font-logo font-extrabold italic text-3xl leading-none">
              <span style={{ color: "var(--color-sg-accent-blue)" }}>SG</span> <span>MOTORS</span>
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-500 mt-1">Automobiles d&apos;occasion</p>
            <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
              <p>{settings?.address || "Actiburo 3 Bâtiment A, 100 Chemin de l'Aumone-Vieille, 13400 Aubagne"}</p>
              <p>{[settings?.phone, settings?.email || "sgmotorsweb@gmail.com"].filter(Boolean).join(" · ")}</p>
              <p className="flex items-center gap-1">SIRET :
                <input value={f.siret || ""} onChange={(e) => set("siret", e.target.value)} placeholder="à compléter"
                  className="bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none text-[11px] w-40 print:border-transparent print:placeholder-transparent" />
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-extrabold tracking-tight">BON DE COMMANDE</h2>
            <p className="text-[11px] text-slate-500 mb-2">Véhicule d&apos;occasion</p>
            <div className="inline-grid grid-cols-[auto_9rem] gap-x-2 gap-y-1 items-center text-left">
              <span className="text-[11px] text-slate-500">N°</span>
              <input value={f.numero || ""} onChange={(e) => set("numero", e.target.value)} className="bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none font-semibold print:border-transparent" />
              <span className="text-[11px] text-slate-500">Date</span>
              <input type="date" value={f.date || ""} onChange={(e) => set("date", e.target.value)} className="bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none font-semibold print:border-transparent" />
            </div>
          </div>
        </header>

        {/* Acheteur */}
        <Section title="Acheteur">
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <Field {...fp("acheteurNom")} label="Nom, prénom / Raison sociale" className="col-span-2" />
            <Field {...fp("acheteurAdresse")} label="Adresse" className="col-span-2" />
            <Field {...fp("acheteurVille")} label="Code postal et ville" />
            <Field {...fp("acheteurNaissance")} label="Date et lieu de naissance" />
            <Field {...fp("acheteurTel")} label="Téléphone" />
            <Field {...fp("acheteurEmail")} label="E-mail" />
          </div>
        </Section>

        {/* Véhicule */}
        <Section title="Véhicule commandé">
          <div className="grid grid-cols-[42%_1fr] gap-5">
            <div className="relative">
              {order.image ? (
                <div className="relative aspect-[4/3] rounded-md overflow-hidden border border-slate-200 bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.image} alt="Véhicule" className="w-full h-full object-cover" />
                  <button onClick={() => setOrder((o) => ({ ...o, image: "" }))} className="no-print absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center" title="Retirer la photo">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => imageInput.current?.click()} className="no-print w-full aspect-[4/3] rounded-md border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[var(--color-sg-accent-blue)] hover:text-[var(--color-sg-accent-blue)] transition-colors">
                  <ImagePlus className="h-8 w-8 mb-1" />
                  <span className="text-xs font-medium">Ajouter une photo du véhicule</span>
                </button>
              )}
              {order.image && <button onClick={() => imageInput.current?.click()} className="no-print mt-1.5 text-xs font-medium" style={{ color: "var(--color-sg-accent-blue)" }}>Changer la photo</button>}
              <input ref={imageInput} type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 content-start">
              <Field {...fp("marque")} label="Marque" />
              <Field {...fp("modele")} label="Modèle" />
              <Field {...fp("motorisation")} label="Motorisation" />
              <Field {...fp("finition")} label="Finition" />
              <Field {...fp("type")} label="Type (carrosserie)" />
              <Field {...fp("couleur")} label="Couleur" />
              <Field {...fp("portes")} label="Nombre de portes" />
              <Field {...fp("boite")} label="Boîte de vitesses" />
              <Field {...fp("puissance")} label="Puissance (ch DIN)" />
              <Field {...fp("puissanceFiscale")} label="Puissance fiscale (CV)" />
              <Field {...fp("co2")} label="Émissions de CO₂ (g/km)" />
              <Field {...fp("kilometrage")} label="Kilométrage" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-2 mt-3">
            <Field {...fp("immatriculation")} label="Immatriculation" />
            <Field {...fp("vin")} label="N° de série (VIN)" />
            <div>
              <Field {...fp("miseEnCirculation")} label="1ère mise en circulation" type="date" />
              <label className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                <input type="checkbox" checked={order.isNew} onChange={(e) => setOrder((o) => ({ ...o, isNew: e.target.checked }))} className="accent-[var(--color-sg-accent-blue)]" />
                Véhicule neuf (0 km)
              </label>
            </div>
            <Field {...fp("garantie")} label="Durée de la garantie" className="col-span-3" placeholder="ex : 12 mois — garantie mécanique pièces et main d'œuvre" />
          </div>
        </Section>

        {/* Prix */}
        <Section title="Prix et règlement">
          <table className="w-full text-[13px]">
            <tbody>
              {order.lines.map((l) => (
                <tr key={l.id} className="border-b border-slate-100 group">
                  <td className="py-1.5 pr-3">
                    <input value={l.label} onChange={(e) => setLine(l.id, { label: e.target.value })}
                      className="w-full bg-transparent border-0 focus:outline-none focus:border-b focus:border-dashed focus:border-slate-300" />
                  </td>
                  <td className="py-1.5 w-40 text-right">
                    <span className="inline-flex items-center justify-end gap-1">
                      <input value={l.amount} inputMode="decimal" onChange={(e) => setLine(l.id, { amount: e.target.value })} placeholder="0"
                        className="w-28 text-right bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none print:border-transparent print:placeholder-transparent" />
                      <span>€</span>
                    </span>
                  </td>
                  <td className="no-print w-8 text-right">
                    <button onClick={() => setOrder((o) => ({ ...o, lines: o.lines.filter((x) => x.id !== l.id) }))} className="p-1 text-slate-300 hover:text-red-500" title="Supprimer la ligne">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 text-slate-600">Remise</td>
                <td className="py-1.5 text-right"><span className="inline-flex items-center gap-1">−<input value={f.remise || ""} inputMode="decimal" onChange={(e) => set("remise", e.target.value)} placeholder="0" className="w-28 text-right bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none print:border-transparent print:placeholder-transparent" /><span>€</span></span></td>
                <td className="no-print" />
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-1.5 pr-3 text-slate-600">Reprise de l&apos;ancien véhicule (déduite)</td>
                <td className="py-1.5 text-right"><span className="inline-flex items-center gap-1">−<input value={f.reprise || ""} inputMode="decimal" onChange={(e) => set("reprise", e.target.value)} placeholder="0" className="w-28 text-right bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none print:border-transparent print:placeholder-transparent" /><span>€</span></span></td>
                <td className="no-print" />
              </tr>
            </tbody>
          </table>
          <button onClick={() => setOrder((o) => ({ ...o, lines: [...o.lines, { id: uid(), label: "Autre (préciser)", amount: "" }] }))}
            className="no-print mt-2 text-xs font-semibold flex items-center gap-1" style={{ color: "var(--color-sg-accent-blue)" }}>
            <Plus className="h-3.5 w-3.5" /> Ajouter une ligne
          </button>

          <div className="mt-3 ml-auto w-72 space-y-1">
            <div className="flex justify-between items-center px-3 py-2 rounded text-white font-bold text-[15px]" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
              <span>PRIX TOTAL TTC</span><span>{euros(total)}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-1">
              <span className="text-slate-600">Acompte versé</span>
              <span className="inline-flex items-center gap-1"><input value={f.acompte || ""} inputMode="decimal" onChange={(e) => set("acompte", e.target.value)} placeholder="0" className="w-24 text-right bg-transparent border-0 border-b border-dashed border-slate-300 focus:outline-none print:border-transparent print:placeholder-transparent" /><span>€</span></span>
            </div>
            <div className="flex justify-between items-center px-3 py-1 font-semibold border-t border-slate-200">
              <span>Reste à payer à la livraison</span><span>{euros(resteAPayer)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 mt-2">
            <Field {...fp("paiement")} label="Mode de règlement" />
            <Field {...fp("financement")} label="Financement (organisme, le cas échéant)" />
          </div>
        </Section>

        {/* Livraison */}
        <Section title="Livraison">
          <div className="no-print flex flex-wrap gap-2 mb-2">
            {([["date", "Date précise"], ["semaine", "N° de semaine"], ["fourchette", "Fourchette de dates"], ["mois", "Mois après signature"]] as [DeliveryMode, string][]).map(([mode, label]) => (
              <button key={mode} onClick={() => setOrder((o) => ({ ...o, deliveryMode: mode }))}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                style={order.deliveryMode === mode ? { backgroundColor: "var(--color-sg-accent-blue)", borderColor: "var(--color-sg-accent-blue)", color: "#fff" } : { borderColor: "#cbd5e1", color: "#475569" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="no-print grid grid-cols-2 gap-x-6 gap-y-2">
            {order.deliveryMode === "date" && <Field {...fp("livraisonDate")} label="Date de livraison" type="date" />}
            {order.deliveryMode === "semaine" && <><Field {...fp("livraisonSemaine")} label="Semaine n°" /><Field {...fp("livraisonAnnee")} label="Année" placeholder={String(new Date().getFullYear())} /></>}
            {order.deliveryMode === "fourchette" && <><Field {...fp("livraisonDu")} label="Entre le" type="date" /><Field {...fp("livraisonAu")} label="Et le" type="date" /></>}
            {order.deliveryMode === "mois" && <Field {...fp("livraisonMois")} label="Nombre de mois après signature" />}
          </div>
          <p className="mt-2 text-[13px]"><span className="text-slate-500">Délai de livraison : </span><strong>{deliveryText() || "à préciser"}</strong></p>
          <Field {...fp("lieuLivraison")} label="Lieu de livraison" className="mt-2" />
        </Section>

        {/* Conditions */}
        <Section title="Observations et conditions">
          <textarea value={f.observations || ""} onChange={(e) => set("observations", e.target.value)} rows={2} placeholder="Observations particulières (options, travaux à réaliser avant livraison…)"
            className="no-print w-full bg-transparent border border-dashed border-slate-300 rounded p-2 text-[12px] focus:outline-none focus:border-[var(--color-sg-accent-blue)] resize-y" />
          {f.observations && <p className="hidden print:block text-[12px] whitespace-pre-line mb-2">{f.observations}</p>}
          <textarea value={f.conditions || ""} onChange={(e) => set("conditions", e.target.value)} rows={4}
            className="no-print mt-2 w-full bg-transparent border border-dashed border-slate-300 rounded p-2 text-[11px] text-slate-600 focus:outline-none focus:border-[var(--color-sg-accent-blue)] resize-y" />
          <p className="hidden print:block text-[10.5px] text-slate-600 whitespace-pre-line">{f.conditions}</p>
        </Section>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-6 break-inside-avoid">
          <div className="border border-slate-300 rounded-md p-3 h-36">
            <p className="text-[11px] font-bold uppercase tracking-wider">Le vendeur</p>
            <p className="text-[10px] text-slate-500">Cachet et signature</p>
          </div>
          <div className="border border-slate-300 rounded-md p-3 h-36">
            <p className="text-[11px] font-bold uppercase tracking-wider">L&apos;acheteur</p>
            <p className="text-[10px] text-slate-500">Mention manuscrite « Bon pour commande », date et signature</p>
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] text-slate-400">
          Fait à Aubagne, le {formatDateFr(f.date)} — en deux exemplaires originaux.
        </p>
      </article>
    </div>
  );
}

// Champ éditable : souligné à l'écran, texte simple à l'impression.
function Field({ value, onChange, label, type = "text", className = "", placeholder }: { value: string; onChange: (v: string) => void; label: string; type?: string; className?: string; placeholder?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-0 border-b border-dashed border-slate-300 focus:border-[var(--color-sg-accent-blue)] focus:outline-none py-1 text-[13px] text-slate-900 print:border-transparent print:placeholder-transparent" />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 break-inside-avoid">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2 pb-1 border-b border-slate-200" style={{ color: "var(--color-sg-accent-blue)" }}>{title}</h3>
      {children}
    </section>
  );
}
