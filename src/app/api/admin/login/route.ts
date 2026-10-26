import { NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/admin-password";
import { ADMIN_COOKIE, SESSION_MAX_AGE, createSessionToken, hasSessionSecret } from "@/lib/admin-session";

export async function POST(req: Request) {
  if (!hasSessionSecret()) {
    return NextResponse.json({ error: "Configuration manquante : ajoutez ADMIN_SESSION_SECRET dans les variables d'environnement." }, { status: 500 });
  }
  const { password } = await req.json().catch(() => ({ password: "" }));
  const expected = await getAdminPassword();
  if (typeof password !== "string" || password !== expected) {
    // Ralentit les tentatives répétées.
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
