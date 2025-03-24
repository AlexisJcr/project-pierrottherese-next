import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sectionKey = searchParams.get("section")

  if (!sectionKey) {
    return NextResponse.json({ error: "Section key is required" }, { status: 400 })
  }

  // Créer un client Supabase directement ici pour éviter les problèmes avec les cookies
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })

  // Requête à la base de données
  const { data, error } = await supabase.from("content_sections").select("*").eq("section_key", sectionKey).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

