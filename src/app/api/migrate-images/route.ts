import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "vehicle-media";

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg", "image/jpg": "jpg", "image/png": "png", "image/webp": "webp",
    "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm",
  };
  return map[mime] || "bin";
}

async function uploadDataUrl(dataUrl: string, folder: "images" | "videos", key: string): Promise<string | null> {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, "base64");
  const path = `${folder}/migrated-${key}.${extFromMime(mime)}`;
  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, { contentType: mime, upsert: true });
  if (error) throw error;
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: vehicles, error } = await supabaseAdmin.from("vehicles").select("id, images, video_url");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results: { id: string; imagesMigrated: number; videoMigrated: boolean; bytesBefore: number }[] = [];

  for (const v of vehicles || []) {
    let images: string[] = typeof v.images === "string" ? JSON.parse(v.images) : v.images || [];
    let videoUrl: string | null = v.video_url;
    let changed = false;
    let imagesMigrated = 0;
    let videoMigrated = false;
    const bytesBefore = JSON.stringify({ images, videoUrl }).length;

    const newImages: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (typeof img === "string" && img.startsWith("data:")) {
        const url = await uploadDataUrl(img, "images", `${v.id}-${i}`);
        if (url) {
          newImages.push(url);
          imagesMigrated++;
          changed = true;
          continue;
        }
      }
      newImages.push(img);
    }
    images = newImages;

    if (typeof videoUrl === "string" && videoUrl.startsWith("data:")) {
      const url = await uploadDataUrl(videoUrl, "videos", v.id);
      if (url) {
        videoUrl = url;
        videoMigrated = true;
        changed = true;
      }
    }

    if (changed) {
      const { error: updateError } = await supabaseAdmin.from("vehicles").update({ images, video_url: videoUrl }).eq("id", v.id);
      if (updateError) {
        return NextResponse.json({ error: `Failed updating ${v.id}: ${updateError.message}`, results }, { status: 500 });
      }
      results.push({ id: v.id, imagesMigrated, videoMigrated, bytesBefore });
    }
  }

  return NextResponse.json({ ok: true, migratedVehicles: results.length, results });
}
