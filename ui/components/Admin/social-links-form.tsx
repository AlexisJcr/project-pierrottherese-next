"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createSupabaseClient, type SocialLink } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Label } from "@/ui/design-system/Label/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/ui/design-system/Card/card"
import { Facebook, Instagram, Save } from "lucide-react"

export function SocialLinksForm() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  async function fetchSocialLinks() {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("social_links").select("*")

      if (error) throw error

      setSocialLinks(data || [])
    } catch (err) {
      console.error("Erreur lors de la récupération des liens sociaux:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (id: string, value: string) => {
    setSocialLinks((prev) => prev.map((item) => (item.id === id ? { ...item, url: value } : item)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      // Mettre à jour chaque lien social
      for (const link of socialLinks) {
        const { error } = await supabase
          .from("social_links")
          .update({
            url: link.url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.id)

        if (error) throw error
      }

      setSuccess("Liens sociaux mis à jour avec succès")
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des liens sociaux...</div>
  }

  // Fonction pour obtenir l'icône appropriée pour chaque plateforme sociale
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      default:
        return <Facebook className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liens sociaux</CardTitle>
        <CardDescription>Modifiez les liens vers vos réseaux sociaux</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {socialLinks.map((link) => (
            <div key={link.id} className="space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-center gap-2">
                {getSocialIcon(link.platform)}
                <Label htmlFor={`url-${link.id}`} className="capitalize">
                  {link.platform}
                </Label>
              </div>
              <Input
                id={`url-${link.id}`}
                value={link.url}
                onChange={(e) => handleChange(link.id, e.target.value)}
                placeholder={`https://${link.platform}.com/votre-compte`}
                required
              />
            </div>
          ))}

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={saving} className="ml-auto">
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            {!saving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

