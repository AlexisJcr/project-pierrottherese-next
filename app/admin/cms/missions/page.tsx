import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { Button } from "@/ui/design-system/Button/button"
import { MissionList } from "@/ui/components/Admin/mission-list"

export default async function AdminMissionsPage() {
  const supabase = await createServerSupabaseClient()

  try {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Erreur d'authentification :", userError);
      redirect("/login");
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user?.id)
      .single();

    if (profileError || !profile) {
      console.error("Erreur lors de la récupération du profil:", profileError);
      redirect("/login");
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
            <h1 className="text-3xl font-bold text-primary">Gestion des missions</h1>
            <Button asChild>
              <Link href="/admin/cms/missions/new">Ajouter une mission</Link>
            </Button>
          </div>

          <MissionList />
        </div>
      </main>
    </div>
  )
}

