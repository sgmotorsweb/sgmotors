import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { nom, prenom, telephone, email, vehicule, message } = await request.json();

    if (!nom || !prenom || !telephone || !email) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailContent = `
        Nouvelle demande de rappel - SG MOTORS

        Véhicule concerné : ${vehicule || "Non précisé"}
        Nom : ${nom}
        Prénom : ${prenom}
        Téléphone : ${telephone}
        Email : ${email}
        Message : ${message || "Aucun message"}
      `;

      await resend.emails.send({
        from: "SG MOTORS <noreply@sgmotors13.com>",
        to: "contact@sgmotors13.com",
        subject: `Rappel demandé - ${nom} ${prenom}`,
        text: emailContent,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
