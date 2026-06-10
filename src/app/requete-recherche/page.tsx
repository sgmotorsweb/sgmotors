"use client";

import { useState } from "react";
import { Search, CheckCircle, Send } from "lucide-react";

const MARQUES = ["Alfa Romeo", "Audi", "BMW", "Citroën", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Peugeot", "Porsche", "Renault", "Seat", "Skoda", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Autre"];

export default function RequeteRecherchePage() {
  const [form, setForm] = useState({ marque: "", modele: "", km: "", description: "", nom: "", prenom: "", email: "", telephone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.marque) e.marque = "Requis";
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail invalide";
    if (!form.telephone.trim()) e.telephone = "Requis";
    return e;
  };

  const saveLocalMessage = async () => {
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recherche",
          data: { nom: form.nom, prenom: form.prenom, telephone: form.telephone, email: form.email, marque: form.marque, modele: form.modele, km: form.km, description: form.description },
        }),
      });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    saveLocalMessage();
    try {
      await fetch("/api/requete-recherche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col flex-1 bg-primary items-center justify-center py-20 px-4">
        <div className="border rounded-2xl p-10 text-center max-w-lg w-full shadow-2xl" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--badge-bg)" }}><CheckCircle className="h-10 w-10" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Requête enregistrée !</h2>
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>Merci <strong style={{ color: "var(--text-primary)" }}>{form.prenom} {form.nom}</strong>, votre recherche pour un {form.marque} {form.modele} a bien été enregistrée.</p>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Notre équipe vous contactera dès qu'un véhicule correspondant sera disponible.</p>
          <button onClick={() => { setSubmitted(false); setForm({ marque: "", modele: "", km: "", description: "", nom: "", prenom: "", email: "", telephone: "" }); }}
            className="px-8 py-3 text-white rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Nouvelle requête</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: "var(--badge-bg)" }}><Search className="h-7 w-7" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>Requête de recherche</h1>
               <p className="max-w-xl" style={{ color: "var(--text-muted)" }}>Vous recherchez un modèle spécifique introuvable dans notre stock ? Confiez-nous votre recherche : nous mobilisons notre réseau professionnel pour vous trouver LA bonne affaire, avec un accompagnement complet de A à Z.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[{ step: "1", title: "Décrivez votre recherche", desc: "Marque, modèle, kilométrage, budget, options souhaitées… Nous échangeons avec vous pour cibler précisément le véhicule de vos rêves." }, { step: "2", title: "Nous mobilisons notre réseau", desc: "Nous activons l'ensemble de notre réseau professionnel (concessionnaires, courtiers, mandataires, ventes privées) pour dénicher la perle rare. Pas de simple recherche internet : un vrai sourcing sur le terrain." }, { step: "3", title: "Accompagnement complet", desc: "De la négociation au contrôle technique, en passant par les démarches administratives (carte grise, garantie, financement), nous vous accompagnons jusqu'à la livraison. Aucun frais caché." }].map((item) => (
            <div key={item.step} className="border rounded-xl p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mb-3" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>{item.step}</div>
              <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="border rounded-2xl p-8 space-y-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border-primary)", paddingBottom: "1rem" }}>Véhicule recherché</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Marque <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
                <select name="marque" value={form.marque} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition cursor-pointer ${errors.marque ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.marque ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }}>
                  <option value="">Choisir…</option>
                  {MARQUES.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                {errors.marque && <p className="mt-1 text-xs text-red-400">{errors.marque}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Modèle</label>
                <input type="text" name="modele" value={form.modele} onChange={handleChange} placeholder="ex : A3" className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Kilométrage maximum</label>
              <input type="number" name="km" value={form.km} onChange={handleChange} placeholder="ex : 50 000 km" className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Description complémentaire</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Précisez vos critères : année, couleur, options, finition, budget, usage prévu…" className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition resize-none" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <div className="border rounded-2xl p-8 space-y-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border-primary)", paddingBottom: "1rem" }}>Vos coordonnées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nom <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.nom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.nom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                {errors.nom && <p className="mt-1 text-xs text-red-400">{errors.nom}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Prénom <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Jean" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.prenom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.prenom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                {errors.prenom && <p className="mt-1 text-xs text-red-400">{errors.prenom}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Adresse e-mail <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean.dupont@email.com" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.email ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.email ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Numéro de téléphone <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
              <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+33 6 00 00 00 00" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.telephone ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.telephone ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.telephone && <p className="mt-1 text-xs text-red-400">{errors.telephone}</p>}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60 text-white rounded-xl font-bold text-base transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
            {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement…</> : <><Send className="h-5 w-5" />Enregistrer ma requête</>}
          </button>
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>* Champs obligatoires. Données traitées conformément à notre <a href="/rgpd" className="hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>politique de confidentialité</a>.</p>
        </form>
      </div>
    </div>
  );
}
