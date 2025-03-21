import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import NavbarShowcase from "@/ui/components/Navbar/navbar"
import { UserForm } from "@/ui/components/Admin/user-form"

export default async function NewUserPage() {
  const supabase = await createServerSupabaseClient()

  // Vérifier si l'utilisateur est connecté
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Vérifier si l'utilisateur est un administrateur
  if (!profile || profile.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarShowcase />
      <main className="flex-1 p-4 pt-20">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Ajouter un utilisateur</h1>
          <UserForm />
        </div>
      </main>
    </div>
  )
}

