import { NextResponse } from "next/server";
import { getAdminPassword, setAdminPassword } from "@/lib/admin-password";

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json();
    if (currentPassword !== (await getAdminPassword())) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
    }
    await setAdminPassword(newPassword);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
