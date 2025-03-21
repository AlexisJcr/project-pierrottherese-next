import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"

export default async function AdherentDashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    // Même en cas d'erreur, on continue pour éviter une boucle de redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6">Espace adhérent</h1>
          <p>Bienvenue dans votre espace adhérent.</p>
        </div>
      </main>
    </div>
  )
}
