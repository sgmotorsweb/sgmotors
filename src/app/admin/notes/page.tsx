"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2, Plus, Search, StickyNote, Trash2 } from "lucide-react";

interface Note {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const titleOf = (content: string) => content.split("\n").find((l) => l.trim())?.trim() || "Nouvelle note";
const previewOf = (content: string) => {
  const lines = content.split("\n").filter((l) => l.trim());
  return lines.slice(1).join(" ").trim() || "Aucun texte supplémentaire";
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const diffDays = (now.getTime() - d.getTime()) / 86400000;
  if (diffDays < 7) return d.toLocaleDateString("fr-FR", { weekday: "long" });
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [mobileEditor, setMobileEditor] = useState(false);
  const pending = useRef<{ id: string; content: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/notes")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Erreur");
        setNotes(json.data || []);
        if (json.data?.[0]) setSelectedId(json.data[0].id);
      })
      .catch((e) => setError(/notes/i.test(String(e.message))
        ? "La table des notes n'existe pas encore : exécutez le fichier supabase-migration-v2.sql dans Supabase."
        : "Impossible de charger les notes."))
      .finally(() => setLoading(false));
  }, []);

  const flush = async () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    setSaveState("saving");
    const res = await fetch(`/api/notes/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: p.content }),
    }).catch(() => null);
    setSaveState(res?.ok ? "saved" : "idle");
    if (!res?.ok) setError("Échec de l'enregistrement de la note. Vérifiez votre connexion.");
  };

  // Enregistre la note en cours quand on quitte l'onglet Notes.
  useEffect(() => () => { flush(); }, []);

  const selected = notes.find((n) => n.id === selectedId) || null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? notes.filter((n) => n.content.toLowerCase().includes(q)) : notes;
  }, [notes, query]);

  const select = async (id: string) => {
    await flush();
    setSelectedId(id);
    setMobileEditor(true);
  };

  const createNote = async () => {
    await flush();
    const res = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: "" }) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setError(json.error || "Impossible de créer la note."); return; }
    setNotes((prev) => [json.data, ...prev]);
    setSelectedId(json.data.id);
    setQuery("");
    setMobileEditor(true);
    setTimeout(() => editorRef.current?.focus(), 0);
  };

  const deleteNote = async (id: string) => {
    if (pending.current?.id === id) { pending.current = null; if (timer.current) clearTimeout(timer.current); }
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    setMobileEditor(false);
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
  };

  const updateContent = (content: string) => {
    if (!selected) return;
    const now = new Date().toISOString();
    setNotes((prev) => [{ ...selected, content, updated_at: now }, ...prev.filter((n) => n.id !== selected.id)]);
    pending.current = { id: selected.id, content };
    setSaveState("idle");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 700);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <StickyNote className="h-7 w-7" style={{ color: "var(--color-sg-accent-blue)" }} /> Notes
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Vos notes sont enregistrées automatiquement.</p>
        </div>
        <button onClick={createNote} disabled={!!error && notes.length === 0 && !loading}
          className="text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50" style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
          <Plus className="h-5 w-5" /> Nouvelle note
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl text-sm border" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c" }}>{error}</div>}

      <div className="border rounded-2xl overflow-hidden flex h-[calc(100vh-14rem)] min-h-[420px]" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <aside className={`${mobileEditor ? "hidden" : "flex"} md:flex w-full md:w-80 shrink-0 flex-col border-r`} style={{ borderColor: "var(--border-primary)", backgroundColor: "#fbfbfa" }}>
          <div className="p-3 border-b" style={{ borderColor: "var(--border-primary)" }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher"
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)]"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }} />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading && <li className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--text-muted)" }} /></li>}
            {!loading && filtered.length === 0 && (
              <li className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>{query ? "Aucun résultat" : "Aucune note"}</li>
            )}
            {filtered.map((n) => {
              const active = n.id === selectedId;
              return (
                <li key={n.id}>
                  <button onClick={() => select(n.id)} className="w-full text-left px-3 py-2.5 rounded-lg transition-colors"
                    style={{ backgroundColor: active ? "#fde68a" : "transparent" }}>
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{titleOf(n.content)}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      <span className="font-medium" style={{ color: "var(--text-secondary)" }}>{formatDate(n.updated_at)}</span>&nbsp;&nbsp;{previewOf(n.content)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className={`${mobileEditor ? "flex" : "hidden"} md:flex flex-1 flex-col min-w-0`}>
          {selected ? (
            <>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b" style={{ borderColor: "var(--border-primary)" }}>
                <button onClick={() => { flush(); setMobileEditor(false); }} className="md:hidden flex items-center gap-1 text-sm font-medium" style={{ color: "var(--color-sg-accent-blue)" }}>
                  <ChevronLeft className="h-4 w-4" /> Notes
                </button>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(selected.updated_at).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })}
                  {saveState === "saving" && " · Enregistrement…"}
                  {saveState === "saved" && " · Enregistré"}
                </p>
                <button onClick={() => deleteNote(selected.id)} className="p-2 rounded-lg hover:bg-red-50" title="Supprimer la note" style={{ color: "#ef4444" }}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <textarea
                ref={editorRef}
                key={selected.id}
                value={selected.content}
                onChange={(e) => updateContent(e.target.value)}
                onBlur={flush}
                placeholder="Commencez à écrire… La première ligne devient le titre de la note."
                className="flex-1 w-full resize-none px-6 py-5 text-[0.95rem] leading-relaxed focus:outline-none first-line:font-bold first-line:text-xl"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8" style={{ color: "var(--text-muted)" }}>
              <StickyNote className="h-12 w-12 mb-3" />
              <p>Sélectionnez une note ou créez-en une nouvelle.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
