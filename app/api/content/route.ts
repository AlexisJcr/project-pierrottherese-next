import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"  // Pour obtenir les cookies côté serveur

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sectionKey = searchParams.get("section")

  if (!sectionKey) {
    return NextResponse.json({ error: "Section key is required" }, { status: 400 })
  }

  // Créer une instance du client Supabase sans vérifier l'authentification
  const supabase = await createServerSupabaseClient()

  // Effectuer la requête à la base de données pour récupérer le contenu de la section
  const { data, error } = await supabase
    .from("content_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Retourner les données de la section demandée
  return NextResponse.json(data)
}
