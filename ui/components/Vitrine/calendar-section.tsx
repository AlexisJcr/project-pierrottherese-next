"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isToday, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { createSupabaseClient, type Event } from "@/lib/supabase-client"
import { Calendar } from "@/ui/design-system/Calendar/calendar"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent } from "@/ui/design-system/Card/card"
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react"

export default function CalendarSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)

        // Récupérer uniquement les événements publics pour la page vitrine
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_public", true)
          .gte("start_date", startOfMonth(currentMonth).toISOString())
          .lte("start_date", endOfMonth(currentMonth).toISOString())
          .order("start_date", { ascending: true })

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
  }, [supabase, currentMonth])

  useEffect(() => {
    if (selectedDate && events.length > 0) {
      const eventsOnSelectedDate = events.filter((event) => {
        const eventStartDate = parseISO(event.start_date)
        return isSameDay(eventStartDate, selectedDate)
      })

      setSelectedEvents(eventsOnSelectedDate)
    } else {
      setSelectedEvents([])
    }
  }, [selectedDate, events])

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const getDayClassNames = (date: Date) => {
    const hasEvents = events.some((event) => {
      const eventStartDate = parseISO(event.start_date)
      return isSameDay(eventStartDate, date)
    })

    return hasEvents ? "bg-primary/20 text-primary font-bold" : ""
  }

  if (loading) {
    return <div className="py-12 text-center">Chargement des événements...</div>
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">Erreur: {error}</div>
  }

  return (
    <section className="bg-muted/30 py-16" id="calendar">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-primary text-center text-3xl font-bold tracking-tight md:text-4xl">Calendrier des Événements</h2>

        <div className="grid gap-8 md:grid-cols-[500px_1fr]">
          <div className="bg-card p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                <ChevronLeft className="h-4 w-4 text-black" />
              </Button>
              <h3 className="text-lg text-tertiary font-medium">{format(currentMonth, "MMMM yyyy", { locale: fr })}</h3>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4 text-black" />
              </Button>
            </div>
            <Calendar
              className="border text-gray-600 rounded-md p-3"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={selectedDate}
              locale={fr}
            />
          </div>

          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl text-secondary font-semibold mb-4">
              {selectedDate
                ? isToday(selectedDate)
                  ? "Aujourd'hui"
                  : format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
                : "Sélectionnez une date"}
            </h3>

            {selectedEvents.length === 0 ? (
              <div className="text-center text-tertiary font-medium py-8 text-muted-foreground">Aucun événement prévu pour cette date</div>
            ) : (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <h4 className="text-lg font-medium">{event.title}</h4>

                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(parseISO(event.start_date), "HH:mm", { locale: fr })} -
                            {format(parseISO(event.end_date), "HH:mm", { locale: fr })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
