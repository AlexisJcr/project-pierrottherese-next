import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

export async function createServerSupabaseClient() {
  const cookieStore = cookies(); // Ceci est une Promise

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const store = await cookieStore; // Attendre la résolution de cookies()
          return store.getAll();
        },
        async setAll(cookiesToSet) {
          const store = await cookieStore; // Attendre la résolution
          cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options)); // Modifier les cookies
        },
      },
    },
  )
}

