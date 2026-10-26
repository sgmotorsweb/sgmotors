import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const TYPE_LABELS: Record<string, string> = {
  reprise: "REPRISE",
  mandat: "DÉPÔT-VENTE / MANDAT",
};

const FIELDS = ["immatriculation", "kilometrage", "annee", "version", "finition", "nom", "prenom", "telephone"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body.type === "mandat" ? "mandat" : body.type === "reprise" ? "reprise" : null;
    const data = Object.fromEntries(FIELDS.map((f) => [f, String(body[f] ?? "").trim().slice(0, 200)]));

    if (!type || !data.immatriculation || !data.nom || !data.prenom || !data.telephone) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const label = TYPE_LABELS[type];
    const { error: dbError } = await getSupabaseAdmin().from("messages").insert({ type, data });
    if (dbError) console.error("vendre: enregistrement du message impossible:", dbError.message);

    const emailContent = `
Nouvelle demande : ${label} - SG MOTORS

Type de demande : ${label}

Véhicule
  Immatriculation : ${data.immatriculation}
  Kilométrage : ${data.kilometrage} km
  Année : ${data.annee}
  Version : ${data.version}
  Finition : ${data.finition || "Non précisée"}

Coordonnées
  Nom : ${data.nom}
  Prénom : ${data.prenom}
  Téléphone : ${data.telephone}
`;

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "SG MOTORS <noreply@sgmotors13.com>",
        to: "contact@sgmotors13.com",
        subject: `[${label}] ${data.immatriculation} - ${data.annee} - ${data.nom} ${data.prenom}`,
        text: emailContent,
      });
      if (error) console.error(`Resend error (${type}):`, error);
    }

    if (dbError) return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
