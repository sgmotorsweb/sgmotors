import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { VehicleData } from "./vehicles";

function normalize(v: any) {
  if (typeof v.options === "string") { try { v.options = JSON.parse(v.options); } catch { v.options = []; } }
  if (typeof v.images === "string") { try { v.images = JSON.parse(v.images); } catch { v.images = []; } }
  v.vehicleType = v.vehicleType ?? v.vehicle_type ?? null;
  v.critAir = v.critAir ?? v.crit_air ?? 1;
  v.powerFiscal = v.powerFiscal ?? v.power_fiscal ?? null;
  v.firstRegDate = v.firstRegDate ?? v.first_reg_date ?? null;
  v.videoUrl = v.videoUrl ?? v.video_url ?? null;
  return v as VehicleData;
}

export async function getServerVehicles(): Promise<VehicleData[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("vehicles").select("*").order("created_at", { ascending: false });
  return (data || []).map(normalize);
}

export async function getServerVehicle(id: string): Promise<VehicleData | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("vehicles").select("*").eq("id", id).single();
  return data ? normalize(data) : null;
}
