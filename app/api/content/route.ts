import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sectionKey = searchParams.get("section")

  if (!sectionKey) {
    return NextResponse.json({ error: "Section key is required" }, { status: 400 })
  }

  // Utiliser createClient directement au lieu de createServerComponentClient
  // Cela évite les problèmes avec les cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // Requête à la base de données
  const { data, error } = await supabase.from("content_sections").select("*").eq("section_key", sectionKey).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

