import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { Button } from "@/ui/design-system/Button/button"
import { EventList } from "@/ui/components/Admin/event-list"

export default async function AdminEventsPage() {
  const supabase = await createServerSupabaseClient()

  try {
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
      redirect("/login")
    }

    // Vérifier si l'utilisateur est un administrateur
    if (!profile || profile.role !== "admin") {
      redirect("/login")
    }
  } catch (error) {
    console.error("Erreur:", error)
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl text-primary font-bold">Gestion des événements</h1>
            <Button asChild>
              <Link href="/admin/cms/events/new">Ajouter un événement</Link>
            </Button>
          </div>

          <EventList />
        </div>
      </main>
    </div>
  )
}

