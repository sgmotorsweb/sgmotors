export interface AppSettings {
  password: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  twitter: string;
  linkedin: string;
  snapchat: string;
  pinterest: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}

const STATIC_DEFAULTS: AppSettings = {
  password: "sgmotors2024",
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
  twitter: "",
  linkedin: "",
  snapchat: "",
  pinterest: "",
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  hours: "Lun – Ven : 9h00 – 19h00\nSamedi : 10h00 – 17h00",
};

export async function fetchServerSettings(): Promise<AppSettings> {
  try {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      return { ...STATIC_DEFAULTS, ...data };
    }
  } catch {}
  return getSettings();
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return { ...STATIC_DEFAULTS };
  try {
    const stored = localStorage.getItem("sgmotors_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...STATIC_DEFAULTS, ...parsed };
    }
  } catch {}
  return { ...STATIC_DEFAULTS };
}

export function saveSettings(s: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sgmotors_settings", JSON.stringify(s));
  fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(s),
  }).catch(() => {});
}

export function verifyPassword(password: string): boolean {
  const settings = getSettings();
  return password === settings.password;
}
