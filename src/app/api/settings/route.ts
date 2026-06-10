import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("settings").select("data").eq("id", 1).single();
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ data: {}, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data?.data || {} });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const { data, error } = await supabaseAdmin.from("settings").upsert(
      { id: 1, data: body, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    ).select().single();
    if (error) throw error;
    return NextResponse.json({ data: data.data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
