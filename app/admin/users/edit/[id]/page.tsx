import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { UserForm } from "@/ui/components/Admin/user-form"

export default async function EditUserPage({ params }: { params: { id: string } }) {
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

  // Récupérer les données de l'utilisateur à modifier
  const { data: userData } = await supabase.auth.admin.getUserById(params.id)

  if (!userData.user) {
    redirect("/admin/users")
  }

  // Récupérer le profil de l'utilisateur à modifier
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4 pt-20">
        <div className="container max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Modifier l'utilisateur</h1>
          <UserForm
            userId={params.id}
            initialData={{
              email: userData.user.email || "",
              first_name: userProfile?.first_name || "",
              last_name: userProfile?.last_name || "",
              role: userProfile?.role || "adherent",
              password: "",
            }}
          />
        </div>
      </main>
    </div>
  )
}

