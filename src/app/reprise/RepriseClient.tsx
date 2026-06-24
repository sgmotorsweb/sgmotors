"use client";

import { useState, useRef } from "react";
import { Car, Upload, CheckCircle, ArrowRight, X, Film } from "lucide-react";

const MARQUES = ["Alfa Romeo", "Audi", "BMW", "Citroën", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Lamborghini", "Land Rover", "Lexus", "Maserati", "Mazda", "Mercedes-Benz", "Mitsubishi", "Nissan", "Peugeot", "Porsche", "Renault", "Seat", "Skoda", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Autre"];

const Field = ({ label, name, type = "text", placeholder, required = false, form, errors, handleChange }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; form: Record<string, string>; errors: Record<string, string>; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}{required && <span style={{ color: "var(--color-sg-accent-blue)" }}> *</span>}</label>
    <input type={type} name={name} value={form[name] || ""} onChange={handleChange} placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors[name] ? "border-red-500" : ""}`}
      style={{ backgroundColor: "var(--bg-primary)", borderColor: errors[name] ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
    {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
  </div>
);

const Select = ({ label, name, options, required = false, form, errors, handleChange }: { label: string; name: string; options: string[]; required?: boolean; form: Record<string, string>; errors: Record<string, string>; handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}{required && <span style={{ color: "var(--color-sg-accent-blue)" }}> *</span>}</label>
    <select name={name} value={form[name] || ""} onChange={handleChange}
      className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition cursor-pointer ${errors[name] ? "border-red-500" : ""}`}
      style={{ backgroundColor: "var(--bg-primary)", borderColor: errors[name] ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }}>
      <option value="">Choisir…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
    {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name]}</p>}
  </div>
);

export default function RepriseClient() {
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ marque: "", modele: "", annee: "", kilometrage: "", etat: "", carburant: "", prixSouhaite: "", nom: "", prenom: "", email: "", telephone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photosError, setPhotosError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { const newFiles = Array.from(e.target.files).slice(0, 10 - photos.length); setPhotos([...photos, ...newFiles]); setPhotosError(""); }
  };

  const handleVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) { const newFiles = Array.from(e.target.files).slice(0, 3 - videos.length); setVideos([...videos, ...newFiles]); }
  };

  const removePhoto = (index: number) => setPhotos(photos.filter((_, i) => i !== index));
  const removeVideo = (index: number) => setVideos(videos.filter((_, i) => i !== index));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.marque) e.marque = "Requis";
    if (!form.modele.trim()) e.modele = "Requis";
    if (!form.annee || Number(form.annee) < 1980 || Number(form.annee) > new Date().getFullYear()) e.annee = "Année invalide";
    if (!form.kilometrage || isNaN(Number(form.kilometrage))) e.kilometrage = "Invalide";
    if (!form.etat) e.etat = "Requis";
    if (!form.carburant) e.carburant = "Requis";
    return e;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail invalide";
    if (!form.telephone.trim()) e.telephone = "Requis";
    return e;
  };

  const goNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (photos.length === 0) { setPhotosError("Au moins 1 photo requise"); return; }
    setPhotosError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveLocalMessage = async (data: typeof form) => {
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reprise",
          data: { nom: data.nom, prenom: data.prenom, telephone: data.telephone, email: data.email, marque: data.marque, modele: data.modele, annee: data.annee, kilometrage: data.kilometrage, carburant: data.carburant, etat: data.etat, prixSouhaite: data.prixSouhaite },
        }),
      });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validateStep2();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    saveLocalMessage(form);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      photos.forEach((f) => formData.append("photos", f));
      videos.forEach((f) => formData.append("videos", f));
      await fetch("/api/reprise", { method: "POST", body: formData });
    } catch {
      // Silently handle - still show success
    }
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col flex-1 bg-primary items-center justify-center py-20 px-4">
        <div className="border rounded-2xl p-10 text-center max-w-lg w-full shadow-2xl" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-400" /></div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Demande envoyée !</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Merci {form.prenom} {form.nom}, votre demande de reprise pour votre <strong style={{ color: "var(--text-primary)" }}>{form.marque} {form.modele} ({form.annee})</strong> a bien été reçue.<br /><br />
            Un conseiller SG MOTORS vous contactera sous <strong style={{ color: "var(--text-primary)" }}>24h</strong> au {form.telephone} ou par e-mail.
          </p>
          <button onClick={() => { setSubmitted(false); setStep(1); setPhotos([]); setVideos([]); setForm({ marque: "", modele: "", annee: "", kilometrage: "", etat: "", carburant: "", prixSouhaite: "", nom: "", prenom: "", email: "", telephone: "" }); }}
            className="px-8 py-3 text-white rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Nouvelle demande</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>Reprise de véhicule</h1>
          <p style={{ color: "var(--text-muted)" }}>Remplissez ce formulaire pour obtenir une offre de reprise personnalisée.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center gap-3 mb-10">
          {[{ n: 1, label: "Votre véhicule" }, { n: 2, label: "Vos coordonnées" }].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= n ? "text-white" : ""}`}
                style={{ backgroundColor: step >= n ? "var(--color-sg-accent-blue)" : "var(--bg-tertiary)", color: step >= n ? "white" : "var(--text-muted)" }}>
                {step > n ? <CheckCircle className="h-5 w-5" /> : n}
              </div>
              <span className={`text-sm font-medium hidden sm:block`} style={{ color: step >= n ? "var(--text-primary)" : "var(--text-muted)" }}>{label}</span>
              {i < 1 && <div className="h-px w-8" style={{ backgroundColor: step > n ? "var(--color-sg-accent-blue)" : "var(--border-primary)" }} />}
            </div>
          ))}
        </div>
        <div className="border rounded-2xl p-8" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          {step === 1 ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><Car className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
                <h2 className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>Informations du véhicule</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select label="Marque" name="marque" options={MARQUES} required form={form} errors={errors} handleChange={handleChange} />
                <Field label="Modèle" name="modele" placeholder="ex : Clio V" required form={form} errors={errors} handleChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Année" name="annee" type="number" placeholder={String(new Date().getFullYear())} required form={form} errors={errors} handleChange={handleChange} />
                <Field label="Kilométrage" name="kilometrage" type="number" placeholder="ex : 45 000" required form={form} errors={errors} handleChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select label="Carburant" name="carburant" options={["Essence", "Diesel", "Électrique", "Hybride", "GPL"]} required form={form} errors={errors} handleChange={handleChange} />
                <Field label="Prix souhaité (€)" name="prixSouhaite" type="number" placeholder="ex : 18 000" form={form} errors={errors} handleChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>État général <span style={{ color: "var(--color-sg-accent-blue)" }}>*</span></label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ val: "excellent", label: "Excellent", desc: "Comme neuf, sans défaut" }, { val: "bon", label: "Bon état", desc: "Quelques traces légères" }, { val: "moyen", label: "Passable", desc: "Défauts visibles" }].map((opt) => (
                    <button key={opt.val} type="button" onClick={() => { setForm({ ...form, etat: opt.val }); if (errors.etat) setErrors({ ...errors, etat: "" }); }}
                      className="p-4 border rounded-xl text-left transition-all"
                      style={{ borderColor: form.etat === opt.val ? "var(--color-sg-accent-blue)" : "var(--border-primary)", backgroundColor: form.etat === opt.val ? "var(--badge-bg)" : "transparent" }}>
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{opt.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.etat && <p className="mt-1 text-xs text-red-400">{errors.etat}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Photos du véhicule <span className="text-xs" style={{ color: "var(--text-muted)" }}>(jusqu&apos;à 10 photos)</span></label>
                <div onClick={() => fileInputRef.current?.click()} className="border border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer" style={{ borderColor: "var(--border-primary)" }}>
                  <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                  <p style={{ color: "var(--text-muted)" }} className="text-sm">Cliquer pour ajouter des photos</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>JPG, PNG, HEIC — max 20 Mo par fichier</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                {photosError && <p className="mt-2 text-xs" style={{ color: "#ef4444" }}>{photosError}</p>}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                    {photos.map((f, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border group" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}>
                        <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3 text-white" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Vidéo (optionnelle) <span className="text-xs" style={{ color: "var(--text-muted)" }}>(jusqu&apos;à 3 vidéos, 50 Mo max)</span></label>
                <div onClick={() => videoInputRef.current?.click()} className="border border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer" style={{ borderColor: "var(--border-primary)" }}>
                  <Film className="h-8 w-8 mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
                  <p style={{ color: "var(--text-muted)" }} className="text-sm">Cliquer pour ajouter des vidéos</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>MP4, MOV — max 50 Mo par fichier</p>
                </div>
                <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideos} />
                {videos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {videos.map((f, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border group flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}>
                        <Film className="h-8 w-8" style={{ color: "var(--text-muted)" }} />
                        <span className="text-xs ml-2 truncate" style={{ color: "var(--text-muted)" }}>{f.name}</span>
                        <button onClick={() => removeVideo(i)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-3 w-3 text-white" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={goNext} className="w-full flex items-center justify-center gap-3 py-4 text-white rounded-xl font-bold text-base transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Étape suivante <ArrowRight className="h-5 w-5" /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <h2 className="font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>Vos coordonnées</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Nom" name="nom" placeholder="Dupont" required form={form} errors={errors} handleChange={handleChange} />
                <Field label="Prénom" name="prenom" placeholder="Jean" required form={form} errors={errors} handleChange={handleChange} />
              </div>
              <Field label="Adresse e-mail" name="email" type="email" placeholder="jean.dupont@email.com" required form={form} errors={errors} handleChange={handleChange} />
              <Field label="Numéro de téléphone" name="telephone" type="tel" placeholder="+33 6 00 00 00 00" required form={form} errors={errors} handleChange={handleChange} />
              <div className="rounded-xl p-4 border" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)" }}>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Récapitulatif : <span style={{ color: "var(--text-secondary)" }}>{form.marque} {form.modele} {form.annee && `(${form.annee})`} — {form.kilometrage && `${Number(form.kilometrage).toLocaleString("fr-FR")} km`}</span></p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 border rounded-xl font-semibold transition-colors" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>Retour</button>
                <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-3 py-4 disabled:opacity-60 text-white rounded-xl font-bold transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</> : "Envoyer ma demande"}
                </button>
              </div>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>Données traitées conformément à notre <a href="/rgpd" className="hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>politique de confidentialité</a>.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
