import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { EventForm } from "@/ui/components/Admin/event-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError)
      redirect("/login")
    }

    // Vérifier si l'utilisateur est un administrateur
    if (!profile || profile.role !== "admin") {
      redirect("/login")
    }

    // Récupérer les données de l'événement à modifier
    const { data: event, error: eventError } = await supabase.from("events").select("*").eq("id", params.id).single()

    if (eventError) {
      console.error("Erreur lors de la récupération de l'événement:", eventError)
      redirect("/admin/cms/events")
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 pt-20">
          <div className="container max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Modifier l'événement</h1>
            <EventForm eventId={params.id} initialData={event} />
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Erreur:", error)
    redirect("/login")
  }
}

