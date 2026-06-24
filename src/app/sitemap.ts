import { MetadataRoute } from "next";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.sgmotors.fr";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/reprise`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/requete-recherche`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cgu`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cgv`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/rgpd`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  let vehiclePages: MetadataRoute.Sitemap = [];
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: vehicles } = await supabaseAdmin
      .from("vehicles")
      .select("id, updated_at")
      .eq("status", "En ligne");

    if (vehicles && vehicles.length > 0) {
      vehiclePages = vehicles.map((v) => ({
        url: `${baseUrl}/vehicule/${v.id}`,
        lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
    }
  } catch (e) {
    console.error("Error generating dynamic sitemap vehicle pages:", e);
  }

  return [...staticPages, ...vehiclePages];
}
