"use client";

import { useState, useEffect } from "react";
import { Inbox, Mail, Phone, Car, CheckCircle, Trash2, Eye, X, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  type: "callback" | "reprise";
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  vehicule: string;
  marque?: string;
  modele?: string;
  date: string;
  message: string;
  status: "lu" | "non lu";
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filterType, setFilterType] = useState<string>("Tous");
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sgmotors_messages");
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  const saveMessages = (updated: Message[]) => {
    setMessages(updated);
    localStorage.setItem("sgmotors_messages", JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    saveMessages(messages.map((m) => m.id === id ? { ...m, status: "lu" as const } : m));
    if (selected && selected.id === id) {
      setSelected({ ...selected, status: "lu" });
    }
  };

  const deleteMessage = (id: string) => {
    saveMessages(messages.filter((m) => m.id !== id));
    if (selected && selected.id === id) setSelected(null);
  };

  const filtered = messages.filter((m) => {
    if (filterType !== "Tous" && m.type !== filterType) return false;
    if (filterStatus !== "Tous" && m.status !== filterStatus) return false;
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === "non lu").length;

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
                <th className="px-6 py-4 font-medium">Véhicule</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border-primary)" }}>
              {filtered.map((msg) => (
                <tr key={msg.id} className="transition-colors cursor-pointer" style={{ backgroundColor: "var(--bg-card)" }}
                  onClick={() => setSelected(msg)}>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      msg.status === "non lu" ? "" : ""
                    }`} style={{
                      backgroundColor: msg.status === "non lu" ? "rgba(0,102,255,0.1)" : "var(--bg-tertiary)",
                      color: msg.status === "non lu" ? "var(--color-sg-accent-blue)" : "var(--text-muted)",
                      borderColor: msg.status === "non lu" ? "rgba(0,102,255,0.2)" : "var(--border-primary)"
                    }}>
                      {msg.status === "non lu" ? <Mail className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {msg.status === "non lu" ? "Non lu" : "Lu"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5" style={{ color: msg.type === "callback" ? "var(--color-sg-accent-blue)" : "#a855f7" }}>
                      {msg.type === "callback" ? <Phone className="h-4 w-4" /> : <Car className="h-4 w-4" />}
                      {msg.type === "callback" ? "Appel" : "Reprise"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium" style={{ color: "var(--text-primary)" }}>{msg.prenom} {msg.nom}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div style={{ color: "var(--text-secondary)" }}>{msg.telephone}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>{msg.vehicule}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {new Date(msg.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {msg.status === "non lu" && (
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
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center" style={{ color: "var(--text-muted)" }}>Aucun message trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setSelected(null)}>
          <div className="rounded-2xl p-8 max-w-lg w-full shadow-2xl border my-8" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: selected.type === "callback" ? "rgba(0,102,255,0.1)" : "rgba(168,85,247,0.1)" }}>
                  {selected.type === "callback" ? <Phone className="h-5 w-5" style={{ color: "var(--color-sg-accent-blue)" }} /> : <Car className="h-5 w-5" style={{ color: "#a855f7" }} />}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {selected.type === "callback" ? "Demande de rappel" : "Demande de reprise"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {new Date(selected.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg transition-colors" style={{ color: "var(--text-muted)" }}><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Prénom</label>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selected.prenom}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Nom</label>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selected.nom}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Téléphone</label>
                  <a href={`tel:${selected.telephone}`} className="font-medium transition-colors" style={{ color: "var(--color-sg-accent-blue)" }}>{selected.telephone}</a>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Email</label>
                  <a href={`mailto:${selected.email}`} className="font-medium transition-colors" style={{ color: "var(--color-sg-accent-blue)" }}>{selected.email}</a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Véhicule concerné</label>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selected.vehicule}</p>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Message</label>
                <div className="p-4 rounded-xl text-sm leading-relaxed" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-primary)" }}>
                  {selected.message}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Statut :</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  selected.status === "non lu" ? "" : ""
                }`} style={{
                  backgroundColor: selected.status === "non lu" ? "rgba(0,102,255,0.1)" : "rgba(34,197,94,0.1)",
                  color: selected.status === "non lu" ? "var(--color-sg-accent-blue)" : "#22c55e",
                  borderColor: selected.status === "non lu" ? "rgba(0,102,255,0.2)" : "rgba(34,197,94,0.2)"
                }}>
                  {selected.status === "non lu" ? <Mail className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                  {selected.status === "non lu" ? "Non lu" : "Lu"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t" style={{ borderColor: "var(--border-primary)" }}>
              {selected.status === "non lu" && (
                <button onClick={() => markAsRead(selected.id)}
                  className="flex-1 py-3 rounded-xl font-medium transition-colors text-white flex items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--color-sg-accent-blue)" }}>
                  <CheckCircle className="h-4 w-4" /> Marquer comme lu
                </button>
              )}
              <button onClick={() => { deleteMessage(selected.id); setSelected(null); }}
                className="py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)", flex: selected.status === "non lu" ? "0 1 auto" : "1" }}>
                <Trash2 className="h-4 w-4" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
