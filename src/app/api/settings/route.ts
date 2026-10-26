import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.from("settings").select("data").eq("id", 1).single();
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ data: {}, error: error.message }, { status: 500 });
  }
  // Le mot de passe de l'Espace Pro ne doit jamais sortir du serveur.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...publicSettings } = data?.data || {};
  return NextResponse.json({ data: publicSettings });
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _ignored, ...body } = await req.json();
    // Le mot de passe se change uniquement via /api/admin/password : on conserve l'existant.
    const { data: current } = await supabaseAdmin.from("settings").select("data").eq("id", 1).maybeSingle();
    const merged = { ...body, ...(current?.data?.password ? { password: current.data.password } : {}) };
    const { error } = await supabaseAdmin.from("settings").upsert(
      { id: 1, data: merged, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );
    if (error) throw error;
    return NextResponse.json({ data: body });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
