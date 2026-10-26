import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { normalizeVehicle } from "@/lib/vehicles";

// Colonnes ajoutées par supabase-migration-v2.sql : si la migration n'a pas encore
// été exécutée, on enregistre quand même le véhicule sans elles.
const NEW_COLUMNS = ["visibility", "extra_info"] as const;

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("vehicles").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  return NextResponse.json({ data: data.map(normalizeVehicle) });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const vehicle: Record<string, unknown> = {
      id: body.id || String(Date.now()),
      make: body.make, model: body.model, year: Number(body.year), price: Number(body.price),
      mileage: Number(body.mileage) || 0, fuel: body.fuel || "Essence",
      transmission: body.transmission || "Automatique", vehicle_type: body.vehicleType || null,
      color: body.color || null,
      doors: Number(body.doors) || 5, seats: Number(body.seats) || 5,
      power: body.power || null, power_fiscal: body.powerFiscal || null,
      consumption: body.consumption || null, co2: body.co2 || null,
      condition: body.condition || null, finition: body.finition || null,
      badge: body.badge || null,
      status: body.status || "En ligne", video_url: body.videoUrl || null,
      images: body.images || [],
      options: body.options || [],
      views: body.views || 0,
      visibility: body.visibility || null,
      extra_info: body.extraInfo || null,
    };
    let { data, error } = await supabaseAdmin.from("vehicles").upsert(vehicle, { onConflict: "id" }).select().single();
    if (error && NEW_COLUMNS.some((c) => error!.message.includes(c))) {
      console.warn("vehicles: colonnes visibility/extra_info absentes, exécutez supabase-migration-v2.sql");
      for (const c of NEW_COLUMNS) delete vehicle[c];
      ({ data, error } = await supabaseAdmin.from("vehicles").upsert(vehicle, { onConflict: "id" }).select().single());
    }
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
