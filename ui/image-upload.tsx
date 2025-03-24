"use client"

import { useState, useRef, type ChangeEvent } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/ui/design-system/Button/button"
import { createSupabaseClient } from "@/lib/supabase-client"

// Client Supabase côté client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = await createSupabaseClient()

interface ImageUploadProps {
  currentImageUrl: string
  onImageUploaded: (url: string) => void
  sectionKey: string
}

export default function ImageUpload({ currentImageUrl, onImageUploaded, sectionKey }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Seuls les fichiers JPG et PNG sont acceptés")
      return
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB")
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Créer un nom de fichier unique
      const fileExt = file.name.split(".").pop()
      const fileName = `${sectionKey}-${Date.now()}.${fileExt}`
      const filePath = `content/${fileName}`

      // Télécharger le fichier vers Supabase Storage
      const { data, error: uploadError } = await supabase.storage.from("images").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      })

      if (uploadError) throw uploadError

      // Obtenir l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath)

      // Mettre à jour l'aperçu et notifier le parent
      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du téléchargement")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeImage = () => {
    setPreviewUrl(null)
    onImageUploaded("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          previewUrl ? "border-muted bg-background" : "border-muted-foreground/25 bg-muted/50 hover:bg-muted/80"
        }`}
        onClick={previewUrl ? undefined : triggerFileInput}
      >
        {previewUrl ? (
          <>
            <div className="relative h-full w-full min-h-[180px]">
              <Image src={previewUrl || "/placeholder.svg"} alt="Image téléchargée" fill className="object-contain" />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2"
              onClick={(e) => {
                e.stopPropagation()
                removeImage()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
            <p className="mb-1 text-sm font-medium">Glissez-déposez une image ou cliquez ici</p>
            <p className="text-xs text-muted-foreground">JPG ou PNG (max. 5MB)</p>
            {isUploading && <p className="mt-2 text-sm text-primary">Téléchargement en cours...</p>}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
    </div>
  )
}