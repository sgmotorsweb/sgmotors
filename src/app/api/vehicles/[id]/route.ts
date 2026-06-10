import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await params;
  const { data, error } = await supabaseAdmin.from("vehicles").select("*").eq("id", id).single();
  if (error) return NextResponse.json({ data: null, error: error.message }, { status: 404 });
  if (typeof data.options === "string") { try { data.options = JSON.parse(data.options); } catch { data.options = []; } }
  if (typeof data.images === "string") { try { data.images = JSON.parse(data.images); } catch { data.images = []; } }
  data.vehicleType = data.vehicleType ?? data.vehicle_type ?? null;
  data.critAir = data.critAir ?? data.crit_air ?? 1;
  data.powerFiscal = data.powerFiscal ?? data.power_fiscal ?? null;
  data.firstRegDate = data.firstRegDate ?? data.first_reg_date ?? null;
  data.videoUrl = data.videoUrl ?? data.video_url ?? null;
  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await params;
  const body = await req.json();
  const { error } = await supabaseAdmin.from("vehicles").update(body).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabaseAdmin = getSupabaseAdmin();
  const { id } = await params;
  const { error } = await supabaseAdmin.from("vehicles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
