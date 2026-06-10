import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { apiKey, to } = await request.json();
    if (!apiKey || !to) {
      return NextResponse.json({ error: "Clé API et email requis" }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "SG MOTORS <noreply@sgmotors13.com>",
      to,
      subject: "Test de configuration email - SG MOTORS",
      text: "Cet email confirme que votre configuration Resend est fonctionnelle. Félicitations !",
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
