import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: vehicles, error: ve } = await supabaseAdmin.from("vehicles").select("id, views");
  if (ve) return NextResponse.json({ error: ve.message }, { status: 500 });

  const { data: messages, error: me } = await supabaseAdmin.from("messages").select("id, type, created_at, read");
  if (me) return NextResponse.json({ error: me.message }, { status: 500 });

  const { data: dailyStats, error: dse } = await supabaseAdmin.from("daily_stats").select("*").order("date", { ascending: true });
  if (dse) return NextResponse.json({ error: dse.message }, { status: 500 });

  const totalCalls = messages.filter((m) => m.type === "callback").length;
  const unreadMessages = messages.filter((m) => !m.read).length;
  const totalViews = vehicles.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalVehicles = vehicles.length;

  return NextResponse.json({
    data: { totalCalls, unreadMessages, totalViews, totalVehicles, dailyStats: dailyStats || [] },
  });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    if (body.type === "view" && body.vehicleId) {
      const { error } = await supabaseAdmin.rpc("increment_vehicle_view", { vehicle_id: body.vehicleId });
      if (error) {
        await supabaseAdmin.from("vehicles").update({ views: supabaseAdmin.rpc("increment") }).eq("id", body.vehicleId);
      }
    }
    if (body.type === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabaseAdmin.from("daily_stats").select("*").eq("date", today).maybeSingle();
      if (existing) {
        const newData = { ...existing.data, ...body.data };
        await supabaseAdmin.from("daily_stats").update({ data: JSON.stringify(newData) }).eq("id", existing.id);
      } else {
        await supabaseAdmin.from("daily_stats").insert({ date: today, data: JSON.stringify(body.data || {}) });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
