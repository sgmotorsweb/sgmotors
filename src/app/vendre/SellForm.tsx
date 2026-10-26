"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Car, CheckCircle, HandCoins, RefreshCw, User } from "lucide-react";

export type SellType = "reprise" | "mandat";

export const SELL_TYPE_LABELS: Record<SellType, string> = {
  reprise: "Reprise",
  mandat: "Dépôt-vente / Mandat",
};

const EMPTY_FORM = { immatriculation: "", kilometrage: "", annee: "", version: "", finition: "", nom: "", prenom: "", telephone: "" };
type FormState = typeof EMPTY_FORM;

const inputClass = "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition";

const Field = ({ label, name, form, errors, onChange, type = "text", placeholder, required, hint }: {
  label: string; name: keyof FormState; form: FormState; errors: Record<string, string>;
  onChange: (name: keyof FormState, value: string) => void; type?: string; placeholder?: string; required?: boolean; hint?: string;
}) => (
  <div>
    <label htmlFor={`sell-${name}`} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
      {label}{required && <span style={{ color: "var(--color-sg-accent-blue)" }}> *</span>}
    </label>
    <input id={`sell-${name}`} name={name} type={type} value={form[name]} placeholder={placeholder}
      onChange={(e) => onChange(name, name === "immatriculation" ? e.target.value.toUpperCase() : e.target.value)}
      className={inputClass}
      style={{ backgroundColor: "var(--bg-primary)", borderColor: errors[name] ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
    {errors[name] ? <p className="mt-1 text-xs text-red-500">{errors[name]}</p> : hint && <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{hint}</p>}
  </div>
);

export default function SellForm({ type }: { type: SellType }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState("");

  const label = SELL_TYPE_LABELS[type];
  const Icon = type === "mandat" ? HandCoins : RefreshCw;

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateVehicle = () => {
    const e: Record<string, string> = {};
    if (form.immatriculation.replace(/[\s-]/g, "").length < 5) e.immatriculation = "Immatriculation invalide";
    if (!form.kilometrage || isNaN(Number(form.kilometrage)) || Number(form.kilometrage) < 0) e.kilometrage = "Kilométrage invalide";
    const year = Number(form.annee);
    if (!year || year < 1950 || year > new Date().getFullYear() + 1) e.annee = "Année invalide";
    if (!form.version.trim()) e.version = "Requis";
    return e;
  };

  const validateContact = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (form.telephone.replace(/\D/g, "").length < 9) e.telephone = "Numéro invalide";
    return e;
  };

  const goNext = () => {
    const e = validateVehicle();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validateContact();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setSendError("");
    try {
      const res = await fetch("/api/vendre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...form }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSendError("L'envoi a échoué. Réessayez ou appelez-nous directement.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col flex-1 bg-primary items-center justify-center py-20 px-4">
        <div className="border rounded-2xl p-10 text-center max-w-lg w-full" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-lg)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "var(--badge-bg)" }}><CheckCircle className="h-10 w-10" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Demande envoyée !</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Merci {form.prenom}, votre demande de <strong style={{ color: "var(--text-primary)" }}>{label.toLowerCase()}</strong> pour le véhicule <strong style={{ color: "var(--text-primary)" }}>{form.immatriculation}</strong> a bien été reçue.<br /><br />
            Un conseiller SG MOTORS vous rappelle sous <strong style={{ color: "var(--text-primary)" }}>24h</strong> au {form.telephone}.
          </p>
          <Link href="/vendre" className="inline-block px-8 py-3 text-white rounded-full font-semibold" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Retour</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <section className="px-4 pt-10 pb-24" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container mx-auto max-w-3xl">
          <Link href="/vendre" className="inline-flex items-center gap-1.5 text-sm mb-6 hover:underline" style={{ color: "rgba(255,255,255,0.7)" }}>
            <ArrowLeft className="h-4 w-4" /> Retour aux solutions de vente
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
              <Icon className="h-7 w-7 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.6)" }}>Demande de</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{label}</h1>
            </div>
          </div>
          {type === "mandat" && (
            <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Réservé aux véhicules de moins de 15 ans et de moins de 150 000 km.</p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-3xl -mt-14 pb-16 relative z-10">
        <div className="rounded-2xl border p-6 md:p-10" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", boxShadow: "var(--shadow-lg)" }}>
          <ol className="flex items-center gap-3 mb-8">
            {[{ n: 1, label: "Véhicule" }, { n: 2, label: "Coordonnées" }].map(({ n, label: stepLabel }, i) => (
              <li key={n} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: step >= n ? "var(--color-sg-accent-blue)" : "var(--bg-tertiary)", color: step >= n ? "#fff" : "var(--text-muted)" }}>
                  {step > n ? <CheckCircle className="h-5 w-5" /> : n}
                </span>
                <span className="text-sm font-semibold" style={{ color: step >= n ? "var(--text-primary)" : "var(--text-muted)" }}>{stepLabel}</span>
                {i === 0 && <span className="h-px w-10 sm:w-16" style={{ backgroundColor: step > 1 ? "var(--color-sg-accent-blue)" : "var(--border-subtle)" }} />}
              </li>
            ))}
          </ol>

          {step === 1 ? (
            <div className="space-y-5">
              <h2 className="flex items-center gap-2 font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                <Car className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> Votre véhicule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Immatriculation" name="immatriculation" placeholder="AB-123-CD" required form={form} errors={errors} onChange={handleChange} />
                <Field label="Kilométrage" name="kilometrage" type="number" placeholder="ex : 85000" required form={form} errors={errors} onChange={handleChange} />
                <Field label="Année" name="annee" type="number" placeholder={String(new Date().getFullYear() - 5)} required form={form} errors={errors} onChange={handleChange} />
                <Field label="Version" name="version" placeholder="ex : 2.0 TDI 150 ch" required form={form} errors={errors} onChange={handleChange} />
              </div>
              <Field label="Finition" name="finition" placeholder="ex : S line, GT Line, Business…" form={form} errors={errors} onChange={handleChange} />
              <button type="button" onClick={goNext} className="w-full flex items-center justify-center gap-2 py-4 text-white rounded-full font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                Étape suivante <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <h2 className="flex items-center gap-2 font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                <User className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> Vos coordonnées
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Nom" name="nom" placeholder="Dupont" required form={form} errors={errors} onChange={handleChange} />
                <Field label="Prénom" name="prenom" placeholder="Jean" required form={form} errors={errors} onChange={handleChange} />
              </div>
              <Field label="Numéro de téléphone" name="telephone" type="tel" placeholder="06 00 00 00 00" required form={form} errors={errors} onChange={handleChange} />
              <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{label}</span> — {form.immatriculation} · {form.annee} · {Number(form.kilometrage).toLocaleString("fr-FR")} km · {form.version}{form.finition && ` ${form.finition}`}
              </div>
              {sendError && <p className="text-sm text-red-500">{sendError}</p>}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button type="button" onClick={() => setStep(1)} className="sm:w-40 py-4 border rounded-full font-semibold" style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}>Retour</button>
                <button type="submit" disabled={loading} className="flex-1 flex items-center justify-center gap-3 py-4 disabled:opacity-60 text-white rounded-full font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</> : "Envoyer ma demande"}
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
