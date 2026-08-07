"use client";

import { supabase } from "@/lib/supabase";

export async function uploadFile(file: File, folder: "images" | "videos"): Promise<string> {
  const res = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, folder }),
  });
  if (!res.ok) throw new Error("Impossible d'obtenir une URL d'envoi");
  const { bucket, path, token } = await res.json();

  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(path, token, file);
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
