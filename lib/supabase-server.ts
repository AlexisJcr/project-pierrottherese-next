import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

// Création du client Supabase côté serveur avec cookies
export function createServerSupabaseClient() {
  const cookieStore = cookies(); // Pas besoin d'await ici
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}
