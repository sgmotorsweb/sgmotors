"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { LogoImage } from "@/components/Logo";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const json = await res.json().catch(() => ({}));
      setError(json.error || "Mot de passe incorrect");
    } catch {
      setError("Erreur réseau, réessayez.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary px-4 py-20">
      <div className="border rounded-2xl p-10 max-w-md w-full shadow-lg" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="text-center mb-8">
          <LogoImage className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Espace Pro</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Connectez-vous pour accéder à l&apos;administration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Entrez le mot de passe"
                className="w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: error ? "#ef4444" : "var(--border-primary)", color: "var(--text-primary)" }} />
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>
          <button type="submit" disabled={loading || !password} className="w-full py-3 text-white rounded-xl font-semibold transition-colors shadow-lg disabled:opacity-60 flex items-center justify-center gap-2" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Se connecter
          </button>
        </form>
        <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
          <a href="/" className="hover:underline" style={{ color: "var(--color-sg-accent-blue)" }}>Retour au site</a>
        </p>
      </div>
    </div>
  );
}
