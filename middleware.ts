import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Créer le client Supabase avec request et response
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Attendre les cookies
  const { data: { session } } = await supabase.auth.getSession()

  // Vérifier si l'utilisateur est connecté pour les routes protégées
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/adherent") ||
    request.nextUrl.pathname === "/dashboard"

  // Si c'est une route protégée et que l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (isAuthRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est déjà connecté et essaie d'accéder à la page de connexion, rediriger vers le dashboard
  if (session && request.nextUrl.pathname === "/login") {
    const redirectUrl = new URL("/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Spécifier les routes sur lesquelles le middleware doit s'exécuter
export const config = {
  matcher: ["/admin/:path*", "/adherent/:path*", "/dashboard", "/login"],
}
