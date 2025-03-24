"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient, type MissionBox } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Textarea } from "@/ui/design-system/TextArea/textarea"
import { Label } from "@/ui/design-system/Label/label"
import { Card, CardContent, CardFooter } from "@/ui/design-system/Card/card"
import ImageUpload from "@/ui/image-upload"

interface MissionFormProps {
  missionId?: string
  initialData?: Partial<MissionBox>
}

export function MissionForm({ missionId, initialData }: MissionFormProps) {
  const isEditing = !!missionId

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    image_url: initialData?.image_url || "",
    position: initialData?.position || 0,
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
      if (!formData.title || !formData.content) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      if (isEditing) {
        // Mise à jour d'une mission existante
        const { error: updateError } = await supabase
          .from("mission_boxes")
          .update({
            title: formData.title,
            content: formData.content,
            image_url: formData.image_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", missionId)

        if (updateError) throw updateError

        setSuccess("Mission mise à jour avec succès")
      } else {
        // Création d'une nouvelle mission
        // D'abord, obtenir la position maximale actuelle
        const { data: maxPositionData, error: maxPositionError } = await supabase
          .from("mission_boxes")
          .select("position")
          .order("position", { ascending: false })
          .limit(1)

        if (maxPositionError) throw maxPositionError

        const maxPosition = maxPositionData && maxPositionData.length > 0 ? maxPositionData[0].position : 0
        const newPosition = maxPosition + 1

        const { error: insertError } = await supabase.from("mission_boxes").insert({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url || null,
          position: newPosition,
        })

        if (insertError) throw insertError

        setSuccess("Mission créée avec succès")

        // Rediriger vers la liste des missions après un court délai
        setTimeout(() => {
          router.push("/admin/missions")
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
    <Card className="text-primary">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la mission</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={5} required />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              currentImageUrl={formData.image_url}
              onImageUploaded={handleImageUploaded}
              sectionKey="missions"
            />
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/missions")}>
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

