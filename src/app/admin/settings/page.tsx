"use client";

import { useState, useEffect } from "react";
import { Settings, Globe, Phone, Key, Save, CheckCircle } from "lucide-react";
import { getSettings, saveSettings, type AppSettings } from "@/lib/settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "social" | "contact">("general");

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    if (!settings) return;
    if (currentPassword !== settings.password) {
      setPasswordError("Mot de passe actuel incorrect");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 4 caractères");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    const updated = { ...settings, password: newPassword };
    setSettings(updated);
    saveSettings(updated);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  if (!settings) return null;

  const tabs = [
    { id: "general" as const, label: "Général", icon: Key },
    { id: "social" as const, label: "Réseaux sociaux", icon: Globe },
    { id: "contact" as const, label: "Contact", icon: Phone },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Paramètres</h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Gérez les paramètres de votre site.</p>
        </div>
      </div>

      <div className="border rounded-xl p-1 flex gap-1" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-primary)" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex-1 justify-center"
              style={isActive ? { backgroundColor: "var(--bg-card)", color: "var(--text-primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } : { color: "var(--text-muted)" }}>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        {activeTab === "general" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Key className="h-5 w-5" /> Modifier le mot de passe
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Changez le mot de passe d&apos;accès à l&apos;administration.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Mot de passe actuel</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nouveau mot de passe</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Confirmer le nouveau mot de passe</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
            </div>
            {passwordError && <p className="text-sm" style={{ color: "#ef4444" }}>{passwordError}</p>}
            {passwordSaved && (
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#22c55e" }}>
                <CheckCircle className="h-4 w-4" /> Mot de passe modifié avec succès
              </div>
            )}
            <button onClick={handlePasswordChange}
              className="text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
              style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
              <Save className="h-4 w-4" /> Modifier le mot de passe
            </button>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Globe className="h-5 w-5" /> Réseaux sociaux
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Configurez les liens vers vos réseaux sociaux.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Facebook</label>
                <input type="url" value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Instagram</label>
                <input type="url" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>YouTube</label>
                <input type="url" value={settings.youtube} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} placeholder="https://youtube.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>TikTok</label>
                <input type="url" value={settings.tiktok} onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })} placeholder="https://tiktok.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Twitter / X</label>
                <input type="url" value={settings.twitter} onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} placeholder="https://x.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>LinkedIn</label>
                <input type="url" value={settings.linkedin} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} placeholder="https://linkedin.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Snapchat</label>
                <input type="url" value={settings.snapchat} onChange={(e) => setSettings({ ...settings, snapchat: e.target.value })} placeholder="https://snapchat.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Pinterest</label>
                <input type="url" value={settings.pinterest} onChange={(e) => setSettings({ ...settings, pinterest: e.target.value })} placeholder="https://pinterest.com/..."
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>WhatsApp (numéro)</label>
                <input type="text" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} placeholder="+33123456789"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <Phone className="h-5 w-5" /> Coordonnées
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Modifiez les informations de contact affichées sur le site.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Numéro de téléphone</label>
                <input type="text" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="01 23 45 67 89"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Adresse e-mail</label>
                <input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="contact@sgmotors13.com"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Adresse</label>
                <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Paris"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Horaires</label>
                <textarea rows={3} value={settings.hours} onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                  placeholder="Lun – Ven : 9h00 – 19h00&#10;Samedi : 10h00 – 17h00"
                  className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition resize-none"
                  style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
          {saved && (
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#22c55e" }}>
              <CheckCircle className="h-4 w-4" /> Paramètres enregistrés
            </div>
          )}
          <button onClick={handleSave}
            className="text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ml-auto"
            style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
            <Save className="h-4 w-4" /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
