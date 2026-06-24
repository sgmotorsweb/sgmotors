"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from "lucide-react";
import { fetchServerSettings } from "@/lib/settings";

export default function ContactClient() {
  const [settings, setSettings] = useState({ phone: "", email: "", address: "", hours: "" });
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", sujet: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServerSettings().then((s) => {
      setSettings({ phone: s.phone || "", email: s.email || "", address: s.address || "", hours: s.hours || "" });
    });
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Le nom est requis.";
    if (!form.prenom.trim()) e.prenom = "Le prénom est requis.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse e-mail invalide.";
    if (!form.sujet) e.sujet = "Veuillez choisir un sujet.";
    if (!form.message.trim() || form.message.length < 20) e.message = "Le message doit contenir au moins 20 caractères.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const saveLocalMessage = async () => {
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          data: { nom: form.nom, prenom: form.prenom, telephone: form.telephone, email: form.email, sujet: form.sujet, message: form.message },
        }),
      });
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    saveLocalMessage();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recipientEmail: settings.email }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col flex-1 bg-primary items-center justify-center py-24 px-4">
        <div className="border rounded-2xl p-12 text-center max-w-md w-full shadow-2xl" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-400" /></div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Message envoyé !</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>Merci {form.prenom}, nous avons bien reçu votre message. Notre équipe vous répondra dans les plus brefs délais.</p>
          <button onClick={() => { setSubmitted(false); setForm({ nom: "", prenom: "", email: "", telephone: "", sujet: "", message: "" }); }}
            className="px-8 py-3 text-white rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Nouveau message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-primary">
      <div className="border-b px-4 py-12" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: "var(--text-primary)" }}>Contactez-nous</h1>
          <p style={{ color: "var(--text-muted)" }}>Notre équipe est disponible pour répondre à toutes vos questions.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            <div className="border rounded-2xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
              <h2 className="font-bold text-lg mb-6" style={{ color: "var(--text-primary)" }}>Nos coordonnées</h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)" }}><MapPin className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Adresse</p>
                    <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{settings.address ? settings.address.split("\n").map((l, i) => <span key={i}>{l}{i < settings.address.split("\n").length - 1 && <br />}</span>) : "—"}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)" }}><Phone className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Téléphone</p>
                    {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-sm mt-0.5 transition-colors" style={{ color: "var(--text-muted)" }}>{settings.phone}</a> : <span className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>—</span>}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)" }}><Mail className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>E-mail</p>
                    {settings.email ? <a href={`mailto:${settings.email}`} className="text-sm mt-0.5 transition-colors" style={{ color: "var(--text-muted)" }}>{settings.email}</a> : <span className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>—</span>}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--badge-bg)" }}><Clock className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Horaires</p>
                    <p className="text-sm mt-0.5 whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{settings.hours || "—"}</p>
                  </div>
                </li>
              </ul>
            </div>
            {settings.phone && <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center justify-center gap-3 w-full py-4 text-white rounded-xl font-bold transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
              <Phone className="h-5 w-5" /> Appeler maintenant
            </a>}
          </div>
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="border rounded-2xl p-8 space-y-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nom *</label>
                  <input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.nom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.nom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                  {errors.nom && <p className="mt-1 text-xs text-red-400">{errors.nom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Prénom *</label>
                  <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Jean" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.prenom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.prenom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                  {errors.prenom && <p className="mt-1 text-xs text-red-400">{errors.prenom}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>E-mail *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jean.dupont@email.com" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.email ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.email ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Téléphone</label>
                  <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="+33 6 00 00 00 00" className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Sujet *</label>
                <select name="sujet" value={form.sujet} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition cursor-pointer ${errors.sujet ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.sujet ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }}>
                  <option value="">Choisir un sujet…</option>
                  <option value="achat">Achat d&apos;un véhicule</option>
                  <option value="reprise">Reprise / Estimation</option>
                  <option value="financement">Financement</option>
                  <option value="garantie">Garantie</option>
                  <option value="autre">Autre demande</option>
                </select>
                {errors.sujet && <p className="mt-1 text-xs text-red-400">{errors.sujet}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Décrivez votre demande en détail…" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition resize-none ${errors.message ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.message ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{form.message.length} caractères</p>
              </div>
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours…</> : <><Send className="h-5 w-5" />Envoyer le message</>}
              </button>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>* Champs obligatoires. Vos données sont traitées conformément à notre{" "}<a href="/rgpd" className="hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>politique de confidentialité</a>.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
