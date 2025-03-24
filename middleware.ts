import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return request.cookies.getAll()
        },
        async setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            response.cookies.set({
              name,
              value,
              ...options,
            })
          })
        },
      },
    },
  )

  // Attendre la récupération de la session utilisateur
  const { data, error } = await supabase.auth.getUser();

if (error) {
  console.error("Erreur lors de la récupération de l'utilisateur :", error);
}

const user = data?.user;

  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/adherent") ||
    request.nextUrl.pathname === "/dashboard"

  if (isAuthRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/adherent/:path*", "/dashboard", "/login"],
}

