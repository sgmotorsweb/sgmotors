"use client";

import { useState } from "react";
import { X, Phone, CheckCircle } from "lucide-react";

export default function CallbackModal({
  isOpen,
  onClose,
  vehicule,
}: {
  isOpen: boolean;
  onClose: () => void;
  vehicule: string;
}) {
  const [form, setForm] = useState({ nom: "", prenom: "", telephone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.prenom.trim()) e.prenom = "Requis";
    if (!form.telephone.trim()) e.telephone = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail invalide";
    return e;
  };

  const saveLocalMessage = (data: typeof form) => {
    try {
      const stored = localStorage.getItem("sgmotors_messages");
      const messages = stored ? JSON.parse(stored) : [];
      messages.unshift({
        id: `msg_${Date.now()}`,
        type: "callback",
        nom: data.nom, prenom: data.prenom, telephone: data.telephone, email: data.email,
        vehicule: vehicule, message: data.message, date: new Date().toISOString(), status: "non lu",
      });
      localStorage.setItem("sgmotors_messages", JSON.stringify(messages));
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    saveLocalMessage(form);
    try {
      await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vehicule }),
      });
    } catch {
      // Silently handle - still show success for UX
    }
    setLoading(false);
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setForm({ nom: "", prenom: "", telephone: "", email: "", message: "" });
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={resetAndClose}>
        <div className="rounded-2xl p-10 max-w-md w-full shadow-2xl border text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }} onClick={(e) => e.stopPropagation()}>
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-green-400" /></div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Demande envoyée !</h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>Merci {form.prenom}, un conseiller SG MOTORS vous rappellera dans les plus brefs délais.</p>
          <button onClick={resetAndClose} className="px-8 py-3 text-white rounded-xl font-semibold transition-colors" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-2xl p-8 max-w-lg w-full shadow-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--badge-bg)" }}><Phone className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /></div>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Être rappelé</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}><X className="h-5 w-5" /></button>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Laissez-nous vos coordonnées pour <strong style={{ color: "var(--text-primary)" }}>{vehicule}</strong>. Un conseiller vous rappelle sous 24h.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nom *</label>
              <input name="nom" value={form.nom} onChange={handleChange} placeholder="Dupont" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.nom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.nom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.nom && <p className="mt-1 text-xs text-red-400">{errors.nom}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Prénom *</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Jean" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.prenom ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.prenom ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.prenom && <p className="mt-1 text-xs text-red-400">{errors.prenom}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Téléphone *</label>
              <input name="telephone" value={form.telephone} onChange={handleChange} type="tel" placeholder="+33 6 00 00 00 00" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.telephone ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.telephone ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.telephone && <p className="mt-1 text-xs text-red-400">{errors.telephone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Email *</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="jean@email.com" className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition ${errors.email ? "border-red-500" : ""}`} style={{ backgroundColor: "var(--bg-primary)", borderColor: errors.email ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Message (optionnel)</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Votre message…" className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition resize-none" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
          </div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-3 py-4 disabled:opacity-60 text-white rounded-xl font-bold transition-colors shadow-lg" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
            {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</> : "Envoyer ma demande"}
          </button>
        </form>
      </div>
    </div>
  );
}
