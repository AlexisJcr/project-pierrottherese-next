"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { createSupabaseClient, type MissionBox } from "@/lib/supabase-client"

export default function MissionsSection() {
  const [missions, setMissions] = useState<MissionBox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
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

    fetchMissions()
  }, [supabase])

  if (loading) {
    return <div className="py-12 text-center">Chargement des missions...</div>
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">Erreur: {error}</div>
  }

  // Organiser les missions en rangées de 2 pour les petits écrans et 3 pour les grands écrans
  const missionRows = []
  for (let i = 0; i < missions.length; i += 3) {
    missionRows.push(missions.slice(i, i + 3))
  }

  return (
    <section className="bg-background py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-primary mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">Nos Missions</h2>

        <div className="space-y-8">
          {missionRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {row.map((mission) => (
                <div key={mission.id} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="relative h-40 w-full">
                    <Image
                      src={mission.image_url || "/placeholder.svg"}
                      alt={mission.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2 text-secondary text-xl font-semibold">{mission.title}</h3>
                    <p className="flex-1 text-tertiary text-muted-foreground">{mission.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

