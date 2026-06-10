export interface AppStats {
  totalViews: number;
  totalVisitors: number;
  totalCallbackRequests: number;
  totalRepriseRequests: number;
  vehicleViews: Record<string, number>;
  dailyStats: Record<string, { views: number; visitors: number; callbacks: number; reprises: number }>;
}

const DEFAULT_STATS: AppStats = {
  totalViews: 0,
  totalVisitors: 0,
  totalCallbackRequests: 0,
  totalRepriseRequests: 0,
  vehicleViews: {},
  dailyStats: {},
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getStats(): AppStats {
  if (typeof window === "undefined") return { ...DEFAULT_STATS, vehicleViews: {}, dailyStats: {} };
  try {
    const stored = localStorage.getItem("sgmotors_stats");
    if (stored) {
      const parsed = JSON.parse(stored) as AppStats;
      return {
        totalViews: parsed.totalViews ?? DEFAULT_STATS.totalViews,
        totalVisitors: parsed.totalVisitors ?? DEFAULT_STATS.totalVisitors,
        totalCallbackRequests: parsed.totalCallbackRequests ?? DEFAULT_STATS.totalCallbackRequests,
        totalRepriseRequests: parsed.totalRepriseRequests ?? DEFAULT_STATS.totalRepriseRequests,
        vehicleViews: parsed.vehicleViews ?? {},
        dailyStats: parsed.dailyStats ?? {},
      };
    }
  } catch {}
  return { ...DEFAULT_STATS, vehicleViews: {}, dailyStats: {} };
}

export function saveStats(s: AppStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sgmotors_stats", JSON.stringify(s));
}

export function trackView(vehicleId: string): void {
  try {
    const stats = getStats();
    stats.totalViews += 1;
    stats.vehicleViews[vehicleId] = (stats.vehicleViews[vehicleId] || 0) + 1;
    const today = getTodayKey();
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = { views: 0, visitors: 0, callbacks: 0, reprises: 0 };
    }
    stats.dailyStats[today].views += 1;
    saveStats(stats);
  } catch {}
}

export function trackVisitor(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("visitor_tracked")) return;
    const stats = getStats();
    stats.totalVisitors += 1;
    const today = getTodayKey();
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = { views: 0, visitors: 0, callbacks: 0, reprises: 0 };
    }
    stats.dailyStats[today].visitors += 1;
    saveStats(stats);
    localStorage.setItem("visitor_tracked", "1");
  } catch {}
}

export function trackCallback(): void {
  try {
    const stats = getStats();
    stats.totalCallbackRequests += 1;
    const today = getTodayKey();
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = { views: 0, visitors: 0, callbacks: 0, reprises: 0 };
    }
    stats.dailyStats[today].callbacks += 1;
    saveStats(stats);
  } catch {}
}

export function trackReprise(): void {
  try {
    const stats = getStats();
    stats.totalRepriseRequests += 1;
    const today = getTodayKey();
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = { views: 0, visitors: 0, callbacks: 0, reprises: 0 };
    }
    stats.dailyStats[today].reprises += 1;
    saveStats(stats);
  } catch {}
}
