import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

// Routes API accessibles sans session (formulaires publics, lecture du catalogue…).
function isPublicApi(pathname: string, method: string) {
  if (pathname === "/api/admin/login") return true;
  if (pathname.startsWith("/api/admin")) return false;
  if (["/api/contact", "/api/callback", "/api/vendre", "/api/requete-recherche"].includes(pathname)) return true;
  if (pathname === "/api/messages") return method === "POST";
  if (pathname === "/api/stats") return method === "POST";
  if (pathname === "/api/settings" || pathname.startsWith("/api/vehicles")) return method === "GET";
  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname.startsWith("/api/")) {
    if (authed || isPublicApi(pathname, request.method)) return NextResponse.next();
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (pathname === "/admin/login") {
    return authed ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  if (!authed) return NextResponse.redirect(new URL("/admin/login", request.url));
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
