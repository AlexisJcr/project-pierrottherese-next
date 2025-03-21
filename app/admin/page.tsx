// admin/page.tsx

"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Textarea } from "@/ui/design-system/TextArea/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/design-system/Card/card"
import type { ContentSection } from "@/lib/supabase-client"
import { createSupabaseClient } from "@/lib/supabase-client"
import ImageUpload from "@/ui/image-upload"

import Navbar from "@/ui/components/Navbar/navbar"

const supabase = createSupabaseClient()

export default function AdminPage() {
  const [section, setSection] = useState<ContentSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("content_sections")
          .select("*")
          .eq("section_key", "presentation")
          .single()

        if (error) throw error
        setSection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!section) return

    try {
      setSaving(true)
      setSuccess(null)
      setError(null)

      const { error } = await supabase
        .from("content_sections")
        .update({
          title: section.title,
          content: section.content,
          image_url: section.image_url,
        })
        .eq("id", section.id)

      if (error) throw error

      setSuccess("Contenu mis à jour avec succès!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    if (section) {
      setSection({
        ...section,
        image_url: url,
      })
    }
  }

  if (loading) {
    return <div className="container py-12">Chargement...</div>
  }

  if (!section) {
    return <div className="container py-12 text-red-500">Section non trouvée</div>
  }

  return (
    <div className="container py-12">
      <Navbar />
      <h1 className="mb-8 text-3xl font-bold">Administration du contenu</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Modifier la section Présentation</CardTitle>
          <CardDescription>Modifiez le contenu qui apparaît dans la section Présentation de votre site</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <Input
                id="title"
                value={section.title}
                onChange={(e) => setSection({ ...section, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Contenu
              </label>
              <Textarea
                id="content"
                value={section.content}
                onChange={(e) => setSection({ ...section, content: e.target.value })}
                rows={10}
                required
              />
              <p className="text-xs text-muted-foreground">
                Utilisez deux retours à la ligne pour créer des paragraphes distincts.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <ImageUpload
                currentImageUrl={section.image_url}
                onImageUploaded={handleImageUploaded}
                sectionKey="presentation"
              />
            </div>

            {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}

            {success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-500">{success}</div>}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
