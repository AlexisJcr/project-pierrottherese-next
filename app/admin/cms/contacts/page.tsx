import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { ContactInfoForm } from "@/ui/components/Admin/contact-info-form"
import { SocialLinksForm } from "@/ui/components/Admin/social-links-form"

export default async function AdminContactsPage() {
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
          <h1 className="text-3xl font-bold mb-6 text-primary">Gestion des contacts</h1>

          <div className="grid gap-8 md:grid-cols-2">
            <ContactInfoForm />
            <SocialLinksForm />
          </div>
        </div>
      </main>
    </div>
  )
}

