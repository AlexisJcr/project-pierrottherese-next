import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // Vérifier si l'utilisateur est connecté avec getUser() au lieu de getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    // Même en cas d'erreur, on continue pour éviter une boucle de redirection
  }

  // Rediriger vers le dashboard approprié en fonction du rôle
  if (profile?.role === "admin") {
    redirect("/admin/dashboard")
  } else {
    redirect("/adherent/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <h1 className="text-2xl font-bold mb-4">Redirection en cours...</h1>
        </div>
      </main>
    </div>
  )
}

