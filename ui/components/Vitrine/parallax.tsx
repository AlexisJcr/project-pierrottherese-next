"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/ui/design-system/Button/button"

import Background from "@/ui/design-system/assets/image/backgroundimage.jpg"

import SectionPres from "@/ui/components/Vitrine/pres-section"

export default function Parallax() {
  const [scrollY, setScrollY] = useState(0)
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  const parallaxOffset = 30 - scrollY * 0.6 // Ajuster cette valeur pour contrôler la vitesse du parallax

  return (
    <div className="relative">
      {/* Section Parallax */}
      <div ref={parallaxRef} className="relative h-screen w-full overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 h-[120%] w-full" style={{ transform: `translateY(-${parallaxOffset}px)` }}>
          <Image
            src={Background}
            alt="Association Le Pierrot Thérèse"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-700/20" />
        </div>

        {/* Contenu superposé */}
        <div className="container relative z-10 flex h-full flex-col justify-center mt-[4vh] ml-10 md:px-6">
          <div className="max-w-xl">
            <h1 className="mb-2 text-5xl font-bold tracking-tight text-tertiary [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] md:text-6xl lg:text-7xl">Association</h1>
            <h2 className="mb-8 text-4xl font-semibold text-white/90 [text-shadow:_0_2px_2px_rgb(0_0_0_/_40%)] md:text-5xl lg:text-6xl">Le Pierrot Thérèse</h2>
            <Button size="lg" className="text-base">
              Nous rejoindre
            </Button>
          </div>
        </div>
      </div>

      {/* Section Présentation avec contenu dynamique */}
      <SectionPres sectionKey="presentation" />

      
    </div>
  )
}

