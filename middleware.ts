import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Créer le client Supabase avec request et response
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Attendre la récupération de la session utilisateur
  const { data: { session } } = await supabase.auth.getSession();

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/adherent") ||
    request.nextUrl.pathname === "/dashboard";

  if (isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/adherent/:path*", "/dashboard", "/login"],
};
