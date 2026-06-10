export interface VehicleData {
  id: string;
  make: string;
  model: string;
  finition?: string;
  year: number;
  firstRegDate?: string;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  vehicleType?: string;
  critAir: number;
  color: string;
  doors: number;
  seats: number;
  power: string;
  powerFiscal?: string;
  consumption: string;
  co2: string;
  condition?: string;
  characteristics?: string[];
  options?: string[];
  warrantyStandard?: string;
  warrantyExtended?: string;
  sellerWarranty?: string;
  images: string[];
  videoUrl?: string;
  badge?: string;
  status?: string;
  views?: number;
}

export async function fetchVehicles(): Promise<VehicleData[]> {
  try {
    const res = await fetch("/api/vehicles");
    if (res.ok) {
      const json = await res.json();
      const data = json.data || [];
      if (typeof window !== "undefined") {
        localStorage.setItem("sgmotors_vehicles", JSON.stringify(data));
      }
      return data;
    }
  } catch {}
  return getVehicles();
}

export async function fetchVehicleById(id: string): Promise<VehicleData | null> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`);
    if (res.ok) {
      const json = await res.json();
      return json.data || null;
    }
  } catch {}
  return getVehicleById(id) || null;
}

export async function saveVehicle(vehicle: VehicleData): Promise<boolean> {
  try {
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    if (!res.ok) return false;
    await fetchVehicles();
    return true;
  } catch {
    return false;
  }
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/vehicles/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) return false;
    await fetchVehicles();
    return true;
  } catch {
    return false;
  }
}

export function getVehicles(): VehicleData[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("sgmotors_vehicles");
    if (stored) return JSON.parse(stored) as VehicleData[];
  } catch {}
  return [];
}

export function getVehicleById(id: string): VehicleData | undefined {
  return getVehicles().find((v) => v.id === id);
}

export function getCatalogueVehicles() {
  return getVehicles().map(({ characteristics, options, warrantyStandard, warrantyExtended, sellerWarranty, videoUrl, ...rest }) => rest);
}


