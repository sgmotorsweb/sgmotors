import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { apiKey: bodyKey, to } = await request.json();
    if (!to) {
      return NextResponse.json({ error: "Email destinataire requis" }, { status: 400 });
    }

    const apiKey = (bodyKey && bodyKey !== "re_placeholder")
      ? bodyKey
      : process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_placeholder") {
      return NextResponse.json({ error: "Aucune clé API valide. Ajoutez RESEND_API_KEY dans les variables d'environnement Vercel ou enregistrez la clé dans ce panneau." }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "SG MOTORS <noreply@sgmotors13.com>",
      to,
      subject: "Test de configuration email - SG MOTORS",
      text: "Cet email confirme que votre configuration Resend est fonctionnelle. Félicitations !",
    });

    if (error) {
      return NextResponse.json({ error: error.message || "Erreur Resend" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
