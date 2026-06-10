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


