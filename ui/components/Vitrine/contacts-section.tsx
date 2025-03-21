"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createSupabaseClient, type ContactInfo, type SocialLink } from "@/lib/supabase-client"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactsSection() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Récupérer les informations de contact
        const { data: contactData, error: contactError } = await supabase
          .from("contact_info")
          .select("*")
          .order("position", { ascending: true })

        if (contactError) throw contactError

        // Récupérer les liens sociaux
        const { data: socialData, error: socialError } = await supabase.from("social_links").select("*")

        if (socialError) throw socialError

        setContactInfo(contactData || [])
        setSocialLinks(socialData || [])
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return <div className="py-12 text-center">Chargement des informations de contact...</div>
  }

  if (error) {
    return <div className="py-12 text-center text-red-500">Erreur: {error}</div>
  }

  // Fonction pour obtenir l'icône appropriée pour chaque type d'information de contact
  const getContactIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "adresse":
        return <MapPin className="h-5 w-5" />
      case "téléphone":
        return <Phone className="h-5 w-5" />
      case "email":
        return <Mail className="h-5 w-5" />
      case "horaires":
        return <Clock className="h-5 w-5" />
      default:
        return <MapPin className="h-5 w-5" />
    }
  }

  // Fonction pour obtenir l'icône appropriée pour chaque plateforme sociale
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-8 w-8" />
      case "instagram":
        return <Instagram className="h-8 w-8" />
      default:
        return <Facebook className="h-8 w-8" />
    }
  }

  return (
    <section className="bg-background py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-primary mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">Contactez-nous</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Informations de contact */}
          <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-xl text-secondary font-semibold mb-4">Nos coordonnées</h3>

            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.id} className="flex items-start gap-3">
                  <div className="text-primary mt-0.5">{getContactIcon(info.label)}</div>
                  <div>
                    <h4 className="text-tertiary font-semibold">{info.label}</h4>
                    <p className="text-gray-600 font-medium text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liens sociaux */}
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <h3 className="text-secondary text-xl font-semibold mb-4">Suivez-nous</h3>

            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <p className="text-tertiary font-semibold text-center text-muted-foreground">
                Retrouvez-nous sur les réseaux sociaux pour suivre nos actualités et événements.
              </p>

              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary/90 transition-colors"
                  >
                    {getSocialIcon(link.platform)}
                    <span className="sr-only">{link.platform}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

