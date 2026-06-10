"use client";

import { useState, useEffect } from "react";
import { Inbox, Mail, Phone, Car, CheckCircle, Trash2, Eye, X, MessageSquare, Search } from "lucide-react";

interface DbMessage {
  id: string;
  type: "callback" | "reprise" | "contact" | "recherche";
  data: Record<string, string>;
  read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [filterType, setFilterType] = useState<string>("Tous");
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [selected, setSelected] = useState<DbMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch {}
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/messages/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    fetchMessages();
  };

  const deleteMessage = async (id: string) => {
    await fetch(`/api/messages/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (selected && selected.id === id) setSelected(null);
    fetchMessages();
  };

  const filtered = messages.filter((m) => {
    if (filterType !== "Tous" && m.type !== filterType) return false;
    if (filterStatus !== "Tous") {
      const isRead = m.read;
      if (filterStatus === "lu" && !isRead) return false;
      if (filterStatus === "non lu" && isRead) return false;
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const d = (m: DbMessage) => m.data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <Inbox className="h-7 w-7" style={{ color: "var(--color-sg-accent-blue)" }} />
            Messagerie
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            {unreadCount > 0 ? `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}` : "Aucun message non lu"}
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
              style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
              <option>Tous</option>
              <option value="callback">Appels</option>
              <option value="reprise">Reprises</option>
              <option value="contact">Contact</option>
              <option value="recherche">Recherche</option>
            </select>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" style={{ color: "var(--text-muted)" }} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sg-accent-blue)] transition"
            style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
            <option>Tous</option>
            <option value="lu">Lu</option>
            <option value="non lu">Non lu</option>
          </select>
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ color: "var(--text-muted)" }}>
            <thead className="border-b" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
              <tr>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Sujet</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-primary)" }}>
              {filtered.map((msg) => {
                const data = d(msg);
                return (
                <tr key={msg.id} className="transition-colors cursor-pointer" style={{ backgroundColor: "var(--bg-card)" }}
                  onClick={() => setSelected(msg)}>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border`} style={{
                      backgroundColor: !msg.read ? "rgba(0,102,255,0.1)" : "var(--bg-tertiary)",
                      color: !msg.read ? "var(--color-sg-accent-blue)" : "var(--text-muted)",
                      borderColor: !msg.read ? "rgba(0,102,255,0.2)" : "var(--border-primary)"
                    }}>
                      {!msg.read ? <Mail className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {!msg.read ? "Non lu" : "Lu"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5" style={{
                      color: msg.type === "callback" ? "var(--color-sg-accent-blue)" :
                             msg.type === "reprise" ? "#a855f7" :
                             msg.type === "recherche" ? "#f59e0b" : "#22c55e"
                    }}>
                      {msg.type === "callback" ? <Phone className="h-4 w-4" /> :
                       msg.type === "reprise" ? <Car className="h-4 w-4" /> :
                       msg.type === "recherche" ? <Search className="h-4 w-4" /> :
                       <MessageSquare className="h-4 w-4" />}
                      {msg.type === "callback" ? "Appel" :
                       msg.type === "reprise" ? "Reprise" :
                       msg.type === "recherche" ? "Recherche" : "Contact"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{data.prenom || ""} {data.nom || ""}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--text-secondary)" }}>{data.telephone || ""}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{data.email || ""}</div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>{data.vehicule || data.sujet || data.marque || ""}{data.modele ? ` ${data.modele}` : ""}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {!msg.read && (
                        <button onClick={() => markAsRead(msg.id)} className="p-2 rounded-lg transition-colors" style={{ color: "#22c55e" }} title="Marquer comme lu">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setSelected(msg)} className="p-2 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }} title="Voir">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteMessage(msg.id)} className="p-2 rounded-lg transition-colors" style={{ color: "#ef4444" }} title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center" style={{ color: "var(--text-muted)" }}>Aucun message trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (() => {
        const data = d(selected);
        const sujet = data.vehicule || data.sujet || `${data.marque || ""} ${data.modele || ""}`.trim();
        return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setSelected(null)}>
          <div className="rounded-2xl p-8 max-w-lg w-full shadow-2xl border my-8" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: selected.type === "callback" ? "rgba(0,102,255,0.1)" : "rgba(168,85,247,0.1)" }}>
                  {selected.type === "callback" ? <Phone className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> : <Car className="h-5 w-5" style={{ color: "#a855f7" }} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {selected.type === "callback" ? "Demande de rappel" :
                     selected.type === "reprise" ? "Demande de reprise" :
                     selected.type === "recherche" ? "Requête de recherche" : "Message contact"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {new Date(selected.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Prénom</label>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{data.prenom || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Nom</label>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{data.nom || "—"}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Téléphone</label>
                  {data.telephone ? (
                    <a href={`tel:${data.telephone}`} className="font-medium transition-colors" style={{ color: "var(--color-sg-accent-blue)" }}>{data.telephone}</a>
                  ) : <p className="font-medium" style={{ color: "var(--text-muted)" }}>—</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Email</label>
                  {data.email ? (
                    <a href={`mailto:${data.email}`} className="font-medium transition-colors" style={{ color: "var(--color-sg-accent-blue)" }}>{data.email}</a>
                  ) : <p className="font-medium" style={{ color: "var(--text-muted)" }}>—</p>}
                </div>
              </div>

              {sujet && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Sujet / Véhicule</label>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{sujet}</p>
              </div>
              )}

              {data.message && (
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Message</label>
                <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  {data.message}
                </div>
              </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Statut :</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border" style={{
                  backgroundColor: !selected.read ? "rgba(0,102,255,0.1)" : "rgba(34,197,94,0.1)",
                  color: !selected.read ? "var(--color-sg-accent-blue)" : "#22c55e",
                  borderColor: !selected.read ? "rgba(0,102,255,0.2)" : "rgba(34,197,94,0.2)"
                }}>
                  {!selected.read ? <Mail className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  {!selected.read ? "Non lu" : "Lu"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
              {!selected.read && (
                <button onClick={() => markAsRead(selected.id)}
                  className="flex-1 py-3 rounded-xl font-medium transition-colors text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  <CheckCircle className="h-4 w-4" /> Marquer comme lu
                </button>
              )}
              <button onClick={() => { deleteMessage(selected.id); setSelected(null); }}
                className="py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)", flex: !selected.read ? "0 1 auto" : "1" }}>
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
