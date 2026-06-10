"use client";

import { useState, useEffect } from "react";
import { Key, Save, CheckCircle, Send, Loader, AlertCircle } from "lucide-react";

interface ApiSettings {
  resendApiKey: string;
}

const DEFAULT_API_SETTINGS: ApiSettings = {
  resendApiKey: "re_placeholder",
};

export default function ApiSettingsPage() {
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_API_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [testError, setTestError] = useState("");
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sgmotors_api_settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleSave = () => {
    localStorage.setItem("sgmotors_api_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestSend = async () => {
    if (!testEmail.trim()) return;
    setTestStatus("sending");
    try {
      const res = await fetch("/api/send-test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: settings.resendApiKey, to: testEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setTestStatus("success");
      } else {
        setTestStatus("error");
        setTestError(data.error || "Erreur inconnue");
      }
    } catch {
      setTestStatus("error");
      setTestError("Erreur réseau");
    }
    setTimeout(() => { setTestStatus("idle"); setTestError(""); }, 6000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <Key className="h-7 w-7" style={{ color: "var(--color-sg-accent-blue)" }} />
            API
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Gérez vos clés d&apos;API et services tiers.</p>
        </div>
      </div>

      <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Key className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> Resend
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Clé API pour l&apos;envoi d&apos;emails transactionnels (notifications, confirmations).</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Resend API Key</label>
            <input type="password" value={settings.resendApiKey}
              onChange={(e) => setSettings({ ...settings, resendApiKey: e.target.value })}
              placeholder="re_..."
              className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
              style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
            {saved && (
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#22c55e" }}>
                <CheckCircle className="h-4 w-4" /> Clé API enregistrée
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

      <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Send className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> Test d&apos;envoi
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Envoyez un email de test pour vérifier votre configuration.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Email de test</label>
              <input type="email" value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
            <div className="flex items-end">
              <button onClick={handleTestSend} disabled={testStatus === "sending" || !testEmail.trim()}
                className="text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                {testStatus === "sending" ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {testStatus === "sending" ? "Envoi..." : "Envoyer un test"}
              </button>
            </div>
          </div>

          {testStatus === "success" && (
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#22c55e" }}>
              <CheckCircle className="h-4 w-4" /> Email de test envoyé avec succès
            </div>
          )}
          {testStatus === "error" && (
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#ef4444" }}>
              <AlertCircle className="h-4 w-4 shrink-0" /> {testError || "Échec de l'envoi"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
