import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { nom, prenom, email, telephone, sujet, message, recipientEmail } = await request.json();

    if (!nom || !prenom || !email || !sujet || !message) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const sujetLabels: Record<string, string> = {
      achat: "Achat d'un véhicule",
      reprise: "Reprise / Estimation",
      financement: "Financement",
      garantie: "Garantie",
      autre: "Autre demande",
    };

    const emailContent = `
      Nouveau message de contact - SG MOTORS

      Sujet : ${sujetLabels[sujet] || sujet}
      Nom : ${nom}
      Prénom : ${prenom}
      Email : ${email}
      Téléphone : ${telephone || "Non renseigné"}

      Message :
      ${message}
    `;

    const to = recipientEmail || "contact@sgmotors13.com";

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "SG MOTORS <noreply@sgmotors13.com>",
        to,
        subject: `Contact - ${sujetLabels[sujet] || sujet} - ${nom} ${prenom}`,
        text: emailContent,
      });

      if (error) {
        console.error("Resend error (contact):", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
