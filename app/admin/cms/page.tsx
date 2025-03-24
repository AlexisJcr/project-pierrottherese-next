import Link from "next/link"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import Navbar from "@/ui/components/Navbar/navbar"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/design-system/Card/card"

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

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
                <CardTitle>Gestion de la présentation</CardTitle>
                <CardDescription>Modifier la présentation sur la vitrine</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/presentation">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion des missions</CardTitle>
                <CardDescription>Gérer les missions affichées sur la vitrine</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/missions">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion des événements</CardTitle>
                <CardDescription>
                  Gérer les événements du calendrier sur la vitrine
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/admin/cms/events">Accéder</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion des contacts</CardTitle>
                <CardDescription>
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

