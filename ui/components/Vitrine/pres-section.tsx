import { useState, useEffect } from "react"
import Image from "next/image"

interface ContentSection {
  id: string
  section_key: string
  title: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
}

interface ContentSectionProps {
  sectionKey: string
}

export default function SectionPres({ sectionKey }: ContentSectionProps) {
  const [section, setSection] = useState<ContentSection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const response = await fetch(`/api/content?section=${sectionKey}`, {
          credentials: 'include'  // Cette option permet d'envoyer les cookies
        })

        if (!response.ok) {
          throw new Error("Erreur fetch pour récupérer le contenu")
        }

        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setSection(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [sectionKey])

  if (loading) {
    return <div className="py-12 text-center">Chargement...</div>
  }

  if (error || !section) {
    return <div className="py-12 text-center text-red-500">Erreur: {error || "Contenu non trouvé"}</div>
  }

  // Diviser le contenu en paragraphes
  const paragraphs = section.content.split("\n\n").filter((p) => p.trim() !== "")

  return (
    <section className="bg-background text-primary p-12">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">{section.title}</h2>

        <div className="grid gap-8 md:grid-cols-2 md:gap-14">
          {/* Texte à gauche */}
          <div className="flex flex-col justify-center space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image à droite */}
          <div className="relative h-64 overflow-hidden rounded-lg md:h-auto">
            <Image src={section.image_url || "/placeholder.svg"} alt={section.title} fill sizes="50vw" className="object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  )
}
