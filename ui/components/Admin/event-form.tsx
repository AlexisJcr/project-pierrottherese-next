"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient, type Event } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Textarea } from "@/ui/design-system/TextArea/textarea"
import { Label } from "@/ui/design-system/Label/label"
import { Card, CardContent, CardFooter } from "@/ui/design-system/Card/card"
import { Switch } from "@/ui/design-system/Switch/switch"
import ImageUpload from "@/ui/image-upload"

interface EventFormProps {
  eventId?: string
  initialData?: Partial<Event>
}

export function EventForm({ eventId, initialData }: EventFormProps) {
  const isEditing = !!eventId

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().slice(0, 16) : "",
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().slice(0, 16) : "",
    image_url: initialData?.image_url || "",
    is_public: initialData?.is_public ?? true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_public: checked }))
  }

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Validation des champs
      if (
        !formData.title ||
        !formData.description ||
        !formData.location ||
        !formData.start_date ||
        !formData.end_date
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        throw new Error("La date de fin doit être postérieure à la date de début")
      }

      if (isEditing) {
        // Mise à jour d'un événement existant
        const { error: updateError } = await supabase
          .from("events")
          .update({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            image_url: formData.image_url || null,
            is_public: formData.is_public,
            updated_at: new Date().toISOString(),
          })
          .eq("id", eventId)

        if (updateError) throw updateError

        setSuccess("Événement mis à jour avec succès")
      } else {
        // Création d'un nouvel événement
        const { error: insertError } = await supabase.from("events").insert({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: formData.start_date,
          end_date: formData.end_date,
          image_url: formData.image_url || null,
          is_public: formData.is_public,
        })

        if (insertError) throw insertError

        setSuccess("Événement créé avec succès")

        // Rediriger vers la liste des événements après un court délai
        setTimeout(() => {
          router.push("/admin/events")
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'événement</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date et heure de début</Label>
              <Input
                id="start_date"
                name="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Date et heure de fin</Label>
              <Input
                id="end_date"
                name="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Image (optionnelle)</Label>
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={handleImageUploaded}
              sectionKey="events"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_public" checked={formData.is_public} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="is_public">Événement public (visible par tous)</Label>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" className="border-gray-500 text-red-600" variant="outline" onClick={() => router.push("/admin/cms/events")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

