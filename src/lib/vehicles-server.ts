import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { VehicleData } from "./vehicles";

export async function getServerVehicles(): Promise<VehicleData[]> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("vehicles").select("*").order("created_at", { ascending: false });
  return (data || []) as VehicleData[];
}

export async function getServerVehicle(id: string): Promise<VehicleData | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("vehicles").select("*").eq("id", id).single();
  return data as VehicleData | null;
}
