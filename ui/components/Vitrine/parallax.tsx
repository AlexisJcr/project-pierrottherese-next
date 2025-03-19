"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/ui/design-system/Button/button"

import Background from "@/ui/design-system/assets/image/backgroundimage.jpg"

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
          <div className="absolute inset-0 bg-gray-500/20" />
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

      {/* Section Présentation */}
      <section className="bg-background py-16">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">Présentation</h2>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Texte à gauche */}
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
                sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla
                enim.
              </p>
              <p className="text-muted-foreground">
                Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut
                dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
              </p>
              <p className="text-muted-foreground">
                Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor
                lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus
                eget in metus.
              </p>
            </div>

            {/* Image à droite */}
            <div className="relative h-64 overflow-hidden rounded-lg md:h-auto">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="À propos de l'association"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

