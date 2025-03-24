"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createSupabaseClient, type MissionBox } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent } from "@/ui/design-system/Card/card"
import { Pencil, Trash2, MoveUp, MoveDown } from "lucide-react"

export function MissionList() {
  const [missions, setMissions] = useState<MissionBox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchMissions()
  }, [])

  async function fetchMissions() {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("mission_boxes").select("*").order("position", { ascending: true })

      if (error) throw error

      setMissions(data || [])
    } catch (err) {
      console.error("Erreur lors de la récupération des missions:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMission = async (missionId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette mission ?")) {
      return
    }

    try {
      const { error } = await supabase.from("mission_boxes").delete().eq("id", missionId)

      if (error) throw error

      // Mettre à jour la liste des missions
      fetchMissions()
    } catch (err) {
      console.error("Erreur lors de la suppression:", err)
      alert("Erreur lors de la suppression de la mission")
    }
  }

  const handleMoveMission = async (missionId: string, direction: "up" | "down") => {
    try {
      const currentIndex = missions.findIndex((mission) => mission.id === missionId)
      if (currentIndex === -1) return

      // Si on essaie de monter le premier élément ou descendre le dernier, ne rien faire
      if (
        (direction === "up" && currentIndex === 0) ||
        (direction === "down" && currentIndex === missions.length - 1)
      ) {
        return
      }

      const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
      const currentMission = missions[currentIndex]
      const swapMission = missions[swapIndex]

      // Échanger les positions
      const { error: error1 } = await supabase
        .from("mission_boxes")
        .update({ position: swapMission.position })
        .eq("id", currentMission.id)

      if (error1) throw error1

      const { error: error2 } = await supabase
        .from("mission_boxes")
        .update({ position: currentMission.position })
        .eq("id", swapMission.id)

      if (error2) throw error2

      // Mettre à jour la liste des missions
      fetchMissions()
    } catch (err) {
      console.error("Erreur lors du déplacement:", err)
      alert("Erreur lors du déplacement de la mission")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des missions...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      {missions.length === 0 ? (
        <div className="text-center py-8">Aucune mission trouvée. Créez votre première mission !</div>
      ) : (
        missions.map((mission) => (
          <Card key={mission.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {mission.image_url && (
                  <div className="relative h-40 w-full md:w-48 rounded-md overflow-hidden">
                    <Image
                      src={mission.image_url || "/placeholder.svg"}
                      alt={mission.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-medium">{mission.title}</h3>
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{mission.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleMoveMission(mission.id, "up")}>
                        <MoveUp className="h-4 w-4" />
                        <span className="sr-only">Monter</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleMoveMission(mission.id, "down")}>
                        <MoveDown className="h-4 w-4" />
                        <span className="sr-only">Descendre</span>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/missions/edit/${mission.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteMission(mission.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

