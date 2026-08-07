import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "vehicle-media";

async function ensureBucket() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: existing } = await supabaseAdmin.storage.getBucket(BUCKET);
  if (!existing) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: "100MB",
    });
    if (error && !/already exists/i.test(error.message)) {
      throw new Error(`Bucket creation failed: ${error.message}`);
    }
  }
}

export async function POST(req: Request) {
  try {
    const { filename, folder } = await req.json();
    if (!filename || (folder !== "images" && folder !== "videos")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await ensureBucket();
    const supabaseAdmin = getSupabaseAdmin();
    const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUploadUrl(path);
    if (error) throw error;
    return NextResponse.json({ bucket: BUCKET, path, token: data.token });
  } catch (err) {
    console.error("upload-url error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
