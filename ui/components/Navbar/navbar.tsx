"use client"

import { useState } from "react"
import Link from "next/link"
import { Facebook, Instagram, Menu } from "lucide-react"

import { Button } from "@/ui/design-system/Button/button"
import { Sheet, SheetContent, SheetTrigger } from "@/ui/design-system/Sheet/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full bg-background/20 bg-primary fixed top-0 z-50 shadow-lg text-gray-50">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">LOGO</span>
            </div>
          </Link>
        </div>

        {/* Navigation sur desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#" className="text-lg font-medium transition-colors hover:text-tertiary">
            Accueil
          </Link>
          <Link href="#presentation" className="text-lg font-medium transition-colors hover:text-tertiary">
            Présentation
          </Link>
          <Link href="#missions" className="text-lg font-medium transition-colors hover:text-tertiary">
            Missions
          </Link>
          <Link href="#calendrier" className="text-lg font-medium transition-colors hover:text-tertiary">
            Calendrier
          </Link>
          <Link href="#contacts" className="text-lg font-medium transition-colors hover:text-tertiary">
            Contacts
          </Link>
        </nav>

        {/* Icônes sociales */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="#" className="text-muted-foreground hover:text-tertiary">
            <Facebook className="h-8 w-8" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-tertiary">
            <Instagram className="h-8 w-8" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>

        {/* Menu burger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="text-base font-medium transition-colors hover:text-tertiary"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/presentation"
                className="text-base font-medium transition-colors hover:text-tertiary"
                onClick={() => setIsOpen(false)}
              >
                Présentation
              </Link>
              <Link
                href="/missions"
                className="text-base font-medium transition-colors hover:text-tertiary"
                onClick={() => setIsOpen(false)}
              >
                Missions
              </Link>
              <Link
                href="/calendrier"
                className="text-base font-medium transition-colors hover:text-tertiary"
                onClick={() => setIsOpen(false)}
              >
                Calendrier
              </Link>
              <Link
                href="/contacts"
                className="text-base font-medium transition-colors hover:text-tertiary"
                onClick={() => setIsOpen(false)}
              >
                Contacts
              </Link>

              <div className="flex items-center gap-4 mt-4">
                <Link href="#" className="text-muted-foreground hover:text-tertiary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-tertiary">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

