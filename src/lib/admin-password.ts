import { getSupabaseAdmin } from "@/lib/supabase-server";

// Mot de passe par défaut tant qu'aucun n'a été défini dans Paramètres.
const DEFAULT_PASSWORD = "sgmotors2024";

export async function getAdminPassword(): Promise<string> {
  const { data } = await getSupabaseAdmin().from("settings").select("data").eq("id", 1).maybeSingle();
  return (data?.data?.password as string) || DEFAULT_PASSWORD;
}

export async function setAdminPassword(password: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin.from("settings").select("data").eq("id", 1).maybeSingle();
  const { error } = await supabaseAdmin.from("settings").upsert(
    { id: 1, data: { ...(data?.data || {}), password }, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) throw error;
}
