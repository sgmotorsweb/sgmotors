import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const SQL = `
CREATE TABLE IF NOT EXISTS settings (
  id bigint PRIMARY KEY DEFAULT 1,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT settings_single_row CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id text PRIMARY KEY,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer DEFAULT 0,
  fuel text DEFAULT 'Essence',
  transmission text DEFAULT 'Automatique',
  vehicle_type text,
  crit_air integer DEFAULT 1,
  color text,
  doors integer DEFAULT 4,
  seats integer DEFAULT 5,
  power text,
  power_fiscal text,
  consumption text,
  co2 text,
  condition text,
  finition text,
  first_reg_date text,
  badge text,
  status text DEFAULT 'En ligne',
  video_url text,
  images jsonb DEFAULT '[]'::jsonb,
  options jsonb DEFAULT '[]'::jsonb,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  data jsonb NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "anon_read_settings" ON settings FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "anon_read_vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "anon_read_daily_stats" ON daily_stats FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "anon_insert_messages" ON messages FOR INSERT WITH CHECK (true);
`;

export async function GET() {
  try {
    const { error } = await getSupabaseAdmin().rpc("exec_sql", { sql: SQL });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message, hint: "exec_sql might not exist. Run SQL manually in Supabase SQL editor." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Migration failed" }, { status: 500 });
  }
}
