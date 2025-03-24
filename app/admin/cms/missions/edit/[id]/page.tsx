import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Navbar from "@/ui/components/Navbar/navbar";
import { MissionForm } from "@/ui/components/Admin/mission-form";

export default async function EditMissionPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();

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

    // 🔹 Vérifier si l'utilisateur est un administrateur
    if (profile.role !== "admin") {
      redirect("/login");
    }

    const missionId = params?.id;

    if (!missionId) {
      console.error("Erreur : ID de mission manquant");
      redirect("/admin/cms/missions");
    }

    // 🔹 Récupérer la mission à modifier
    const { data: mission, error: missionError } = await supabase
      .from("mission_boxes")
      .select("*")
      .eq("id", missionId)
      .single();

    if (missionError) {
      console.error("Erreur lors de la récupération de la mission:", missionError);
      redirect("/admin/cms/missions");
    }

    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 pt-20">
          <div className="container max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Modifier la mission</h1>
            <MissionForm missionId={missionId} initialData={mission} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Erreur:", error);
    redirect("/login");
  }
}
