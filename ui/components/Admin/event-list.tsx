"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { createSupabaseClient, type Event } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent } from "@/ui/design-system/Card/card"
import { Badge } from "@/ui/design-system/Badge/badge"
import { Pencil, Trash2, Calendar } from "lucide-react"

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)

        const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

        if (error) throw error

        setEvents(data || [])
      } catch (err) {
        console.error("Erreur lors de la récupération des événements:", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [supabase])

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      return
    }

    try {
      const { error } = await supabase.from("events").delete().eq("id", eventId)

      if (error) throw error

      // Mettre à jour la liste des événements
      setEvents(events.filter((event) => event.id !== eventId))
    } catch (err) {
      console.error("Erreur lors de la suppression:", err)
      alert("Erreur lors de la suppression de l'événement")
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMMM yyyy à HH:mm", { locale: fr })
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des événements...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-8">Aucun événement trouvé. Créez votre premier événement !</div>
      ) : (
        events.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {event.image_url && (
                  <div className="relative h-40 w-full md:w-48 rounded-md overflow-hidden">
                    <Image
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-medium">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.start_date)}</span>
                      </div>
                      <p className="text-sm mt-2">{event.location}</p>
                      <Badge className="mt-2" variant={event.is_public ? "default" : "outline"}>
                        {event.is_public ? "Public" : "Privé (adhérents)"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" asChild>
                        <Link href={`/admin/events/edit/${event.id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

