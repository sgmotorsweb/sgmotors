"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getStats } from "@/lib/stats";

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

function getLast4Weeks() {
  const weeks = [];
  for (let i = 3; i >= 0; i--) {
    weeks.push(`S${new Date().getWeek() - i}`);
  }
  return weeks;
}

declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function () {
  const d = new Date(this);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

function getCSSVar(name: string): string {
  if (typeof document === 'undefined') return '#111827';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#111827';
}

export function ViewsChart() {
  const bgCard = getCSSVar('--bg-card');
  const borderColor = getCSSVar('--border-primary');
  const stats = getStats();

  const last7 = getLast7Days();
  const viewData = last7.map((date, i) => {
    const dayStats = stats.dailyStats[date];
    return { name: DAYS[i], views: dayStats?.views || 0 };
  });

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

export function LeadsChart() {
  const bgCard = getCSSVar('--bg-card');
  const borderColor = getCSSVar('--border-primary');
  const stats = getStats();

  const last7 = getLast7Days();
  const weeks: Record<string, { callbacks: number; reprises: number }> = {};
  last7.forEach((date) => {
    const d = new Date(date);
    const weekNum = d.getWeek();
    const key = `S${weekNum}`;
    if (!weeks[key]) weeks[key] = { callbacks: 0, reprises: 0 };
    const dayStats = stats.dailyStats[date];
    if (dayStats) {
      weeks[key].callbacks += dayStats.callbacks || 0;
      weeks[key].reprises += dayStats.reprises || 0;
    }
  });

  const leadData = Object.entries(weeks).map(([name, vals]) => ({
    name,
    leads: vals.callbacks + vals.reprises,
  }));

  if (leadData.length === 0) {
    const dummy = getLast4Weeks();
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dummy.map((n) => ({ name: n, leads: 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
