import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"

import { Button } from "@/ui/design-system/Button/button"
import { UserManagement } from "@/ui/components/Admin/user-management"

export default async function AdminUsersPage() {
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
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <Button asChild>
              <Link href="/admin/users/new">Ajouter un utilisateur</Link>
            </Button>
          </div>

          <UserManagement />
        </div>
      </main>
    </div>
  )
}