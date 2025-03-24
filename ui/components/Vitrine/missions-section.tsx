"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { createSupabaseClient, type MissionBox } from "@/lib/supabase-client"

export default function MissionsSection() {
  const [missions, setMissions] = useState<MissionBox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    let isMounted = true

    async function fetchMissions() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("mission_boxes").select("*").order("position", { ascending: true })

        if (error) throw error

        if (isMounted) {
          setMissions(data || [])
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des missions:", err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Une erreur est survenue")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchMissions()

    return () => {
      isMounted = false
    }
  }, [supabase])

  // Organiser les missions en rangées de 2 pour les petits écrans et 3 pour les grands écrans
  const missionRows = useMemo(() => {
    const rows = []
    for (let i = 0; i < missions.length; i += 3) {
      rows.push(missions.slice(i, i + 3))
    }
    return rows
  }, [missions])

  if (loading) {
    return <div className="py-12 text-center">Chargement des missions...</div>
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">Erreur: {error}</div>
  }

  return (
    <section className="bg-background py-16">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl text-primary">Nos Missions</h2>

        <div className="space-y-8">
          {missionRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {row.map((mission) => (
                <div key={mission.id} className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
                  <div className="relative h-48 w-full">
                    <Image
                      src={mission.image_url || "/placeholder.svg"}
                      alt={mission.title}
                      fill
                      sizes="50vw"
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-2 text-xl font-semibold text-secondary">{mission.title}</h3>
                    <p className="flex-1 text-tertiary">{mission.content}</p>
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

