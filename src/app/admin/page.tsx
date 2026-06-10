"use client";

import { useEffect, useState } from "react";
import { Eye, MessageSquare, Car, TrendingUp, Users } from "lucide-react";
import { ViewsChart, LeadsChart } from "./DashboardCharts";
import { getStats } from "@/lib/stats";
import { getVehicles } from "@/lib/vehicles";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalViews: 0, totalVisitors: 0, totalCallbackRequests: 0, totalRepriseRequests: 0 });
  const [vehicleCount, setVehicleCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const s = getStats();
    setStats({ totalViews: s.totalViews, totalVisitors: s.totalVisitors, totalCallbackRequests: s.totalCallbackRequests, totalRepriseRequests: s.totalRepriseRequests });
    const vehicles = getVehicles();
    setVehicleCount(vehicles.length);
    setOnlineCount(vehicles.filter((v) => v.status === "En ligne").length);
  }, []);

  const cards = [
    { label: "Vues totales", value: stats.totalViews.toLocaleString("fr-FR"), icon: Eye, color: "var(--color-sg-accent-blue)" },
    { label: "Visiteurs uniques", value: stats.totalVisitors.toLocaleString("fr-FR"), icon: Users, color: "#8b5cf6" },
    { label: "Demandes de rappel", value: String(stats.totalCallbackRequests), icon: MessageSquare, color: "#25D366" },
    { label: "Demandes de reprise", value: String(stats.totalRepriseRequests), icon: Car, color: "#f97316" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Tableau de bord</h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>Bienvenue dans votre espace administrateur SG MOTORS.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>{card.label}</p>
                <h3 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{card.value}</h3>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${card.color}15` }}>
                <card.icon className="h-6 w-6" style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
        <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Véhicules en ligne</p>
          <h3 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{onlineCount}</h3>
        </div>
        <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Total inventaire</p>
          <h3 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>{vehicleCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Trafic 7 derniers jours (Vues)</h3>
          <ViewsChart />
        </div>
        <div className="border rounded-xl p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Leads (Appels + Reprises)</h3>
          <LeadsChart />
        </div>
      </div>
    </div>
  );
}
