import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const cookieStore = await cookies(); // <-- Utilisation correcte
  const authToken = cookieStore.get("sb-gzdavygtvoqwiujbudft-auth-token")?.value;

  console.log("Auth Token:", authToken); // Vérifie si le token est bien récupéré

  const supabase = createServerSupabaseClient(); // Assurez-vous que cela est awaité correctement

  const { searchParams } = new URL(request.url);
  const sectionKey = searchParams.get("section");

  if (!sectionKey) {
    return NextResponse.json({ error: "Section key is required" }, { status: 400 });
  }

  // Requête à la base de données
  const { data, error } = await supabase
    .from("content_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}