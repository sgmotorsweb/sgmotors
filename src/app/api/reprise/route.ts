import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const marque = formData.get("marque") as string;
    const modele = formData.get("modele") as string;
    const annee = formData.get("annee") as string;
    const kilometrage = formData.get("kilometrage") as string;
    const carburant = formData.get("carburant") as string;
    const etat = formData.get("etat") as string;
    const prixSouhaite = formData.get("prixSouhaite") as string;
    const nom = formData.get("nom") as string;
    const prenom = formData.get("prenom") as string;
    const email = formData.get("email") as string;
    const telephone = formData.get("telephone") as string;
    const photos = formData.getAll("photos") as File[];
    const videos = formData.getAll("videos") as File[];

    if (!nom || !prenom || !email || !telephone || !marque || !modele) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const fileInfos = [
      ...photos.map((f) => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} Mo)`),
      ...videos.map((f) => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(1)} Mo)`),
    ].join("\n");

    const emailContent = `
      Nouvelle demande de reprise - SG MOTORS

      Véhicule : ${marque} ${modele} (${annee})
      Kilométrage : ${kilometrage} km
      Carburant : ${carburant}
      État : ${etat}
      Prix souhaité : ${prixSouhaite || "Non précisé"} €

      Coordonnées :
      Nom : ${nom}
      Prénom : ${prenom}
      Email : ${email}
      Téléphone : ${telephone}

      Fichiers joints (${photos.length + videos.length}) :
      ${fileInfos || "Aucun fichier"}
    `;

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "SG MOTORS <noreply@sgmotors13.com>",
        to: "contact@sgmotors13.com",
        subject: `Reprise - ${marque} ${modele} (${annee}) - ${nom} ${prenom}`,
        text: emailContent,
      });

      if (error) {
        console.error("Resend error (reprise):", error);
      }
    }

    return NextResponse.json({ success: true, files: photos.length + videos.length });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
