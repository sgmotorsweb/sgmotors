import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { marque, modele, km, description, nom, prenom, email, telephone } = await request.json();

    if (!marque || !nom || !prenom || !email || !telephone) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const emailContent = `
      Nouvelle requête de recherche - SG MOTORS

      Véhicule recherché : ${marque} ${modele || ""}
      Kilométrage max : ${km || "Non précisé"} km
      Description : ${description || "Aucune"}

      Coordonnées :
      Nom : ${nom}
      Prénom : ${prenom}
      Email : ${email}
      Téléphone : ${telephone}
    `;

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "SG MOTORS <noreply@sgmotors13.com>",
        to: "contact@sgmotors13.com",
        subject: `Requête de recherche - ${marque} ${modele || ""} - ${nom} ${prenom}`,
        text: emailContent,
      });

      if (error) {
        console.error("Resend error (requete-recherche):", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
