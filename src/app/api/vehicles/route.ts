import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("vehicles").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ data: [], error: error.message }, { status: 500 });
  for (const v of data) {
    if (typeof v.options === "string") { try { v.options = JSON.parse(v.options); } catch { v.options = []; } }
    if (typeof v.images === "string") { try { v.images = JSON.parse(v.images); } catch { v.images = []; } }
  }
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const vehicle = {
      id: body.id || String(Date.now()),
      make: body.make, model: body.model, year: Number(body.year), price: Number(body.price),
      mileage: Number(body.mileage) || 0, fuel: body.fuel || "Essence",
      transmission: body.transmission || "Automatique", vehicle_type: body.vehicleType || null,
      crit_air: Number(body.critAir) || 1, color: body.color || null,
      doors: Number(body.doors) || 4, seats: Number(body.seats) || 5,
      power: body.power || null, power_fiscal: body.powerFiscal || null,
      consumption: body.consumption || null, co2: body.co2 || null,
      condition: body.condition || null, finition: body.finition || null,
      first_reg_date: body.firstRegDate || null, badge: body.badge || null,
      status: body.status || "En ligne", video_url: body.videoUrl || null,
      images: body.images || [],
      options: body.options || [],
      views: body.views || 0,
    };
    const { data, error } = await supabaseAdmin.from("vehicles").upsert(vehicle, { onConflict: "id" }).select().single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
