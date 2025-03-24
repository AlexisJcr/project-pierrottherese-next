import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/design-system/Card/card"

export default async function AdminDashboardPage() {
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

  // Vérifier si l'utilisateur est un administrateur
  if (!profile || profile.role !== "admin") {
    redirect("/adherent/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4 pt-20">
        <div className="container">
          <h1 className="text-3xl text-primary font-bold mb-6">Gestionnaire de contenu</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
              <CardHeader>
                <CardTitle className="text-secondary">Gestion de la présentation</CardTitle>
                <CardDescription className="text-tertiary">Modifier la présentation sur la vitrine</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/presentation">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-secondary">Gestion des missions</CardTitle>
                <CardDescription className="text-tertiary">Gérer les missions affichées sur la vitrine</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/missions">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-secondary">Gestion des événements</CardTitle>
                <CardDescription className="text-tertiary">Gérer les événements du calendrier sur la vitrine</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/events">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-secondary">Gestion des contacts</CardTitle>
                <CardDescription className="text-tertiary">
                  Modifier les informations de contact et liens sociaux sur la vitrine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/contacts">Accéder</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}