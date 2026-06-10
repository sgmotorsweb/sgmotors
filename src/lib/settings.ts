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

const DEFAULT_SETTINGS: AppSettings = {
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

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const stored = localStorage.getItem("sgmotors_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(s: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sgmotors_settings", JSON.stringify(s));
}

export function verifyPassword(password: string): boolean {
  const settings = getSettings();
  return password === settings.password;
}
