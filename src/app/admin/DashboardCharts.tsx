"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function getCSSVar(name: string): string {
  if (typeof document === 'undefined') return '#111827';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#111827';
}

export function ViewsChart({ dailyStats }: { dailyStats: Record<string, { views?: number }> }) {
  const bgCard = getCSSVar('--bg-card');
  const borderColor = getCSSVar('--border-primary');

  const last7 = getLast7Days();
  const viewData = last7.map((date, i) => ({
    name: DAYS[i],
    views: dailyStats[date]?.views || 0,
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={viewData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={borderColor} vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: bgCard, borderColor: borderColor, color: 'var(--text-primary)' }}
            itemStyle={{ color: '#00d2ff' }}
            cursor={{ fill: borderColor, opacity: 0.4 }}
          />
          <Bar dataKey="views" fill="#0066ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeadsChart({ dailyStats }: { dailyStats: Record<string, { callbacks?: number; reprises?: number }> }) {
  const bgCard = getCSSVar('--bg-card');
  const borderColor = getCSSVar('--border-primary');

  const last7 = getLast7Days();
  const weekCounts: Record<string, number> = {};
  last7.forEach((date) => {
    const day = new Date(date);
    const weekStart = new Date(day);
    weekStart.setDate(day.getDate() - day.getDay() + 1);
    const key = weekStart.toISOString().slice(0, 10);
    const ds = dailyStats[date];
    weekCounts[key] = (weekCounts[key] || 0) + (ds?.callbacks || 0) + (ds?.reprises || 0);
  });

  const leadData = Object.entries(weekCounts).map(([date, leads], i) => ({
    name: `S${i + 1}`,
    leads,
  }));

  if (leadData.length === 0) {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[{ name: "S1", leads: 0 }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={borderColor} vertical={false} />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: bgCard, borderColor: borderColor }} />
            <Line type="monotone" dataKey="leads" stroke="#25D366" strokeWidth={3} dot={{ fill: '#25D366', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={leadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={borderColor} vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: bgCard, borderColor: borderColor, color: 'var(--text-primary)' }}
            itemStyle={{ color: '#25D366' }}
          />
          <Line type="monotone" dataKey="leads" stroke="#25D366" strokeWidth={3} dot={{ fill: '#25D366', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
