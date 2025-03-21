"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Facebook, Instagram, Menu, LogIn, LogOut, User } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase-client"

import Logo from "@/ui/design-system/assets/icon/pierrottherese.png"

import { Button } from "@/ui/design-system/Button/button"
import { Sheet, SheetContent, SheetTrigger } from "@/ui/design-system/Sheet/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/design-system/Dropdown/dropdown-menu"

export default function NavbarShowcase() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function getUser() {
      try {
        // Vérifier si l'utilisateur est connecté
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Récupérer le rôle de l'utilisateur
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (error) {
            console.error("Erreur lors de la récupération du profil:", error)
          } else if (profile) {
            setUserRole(profile.role)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)

        // Récupérer le rôle de l'utilisateur
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error)
        } else if (profile) {
          setUserRole(profile.role)
        }
      } else {
        setUser(null)
        setUserRole(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getDashboardLink = () => {
    if (userRole === "admin") {
      return "/admin/dashboard"
    } else {
      return "/adherent/dashboard"
    }
  }

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur-sm fixed top-0 z-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo à gauche */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-muted flex items-center justify-center">
              <Image alt="Icon" src={Logo} width={70}></Image>
            </div>
          </Link>
        </div>

        {/* Navigation sur desktop */}
        <nav className="hidden text-primary md:flex items-center gap-6">
          <Link href="/" className="text-lg font-medium transition-colors hover:text-tertiary">
            Accueil
          </Link>
          <Link href="/#presentation" className="text-lg font-medium transition-colors hover:text-tertiary">
            Présentation
          </Link>
          <Link href="/#missions" className="text-lg font-medium transition-colors hover:text-tertiary">
            Missions
          </Link>
          <Link href="/#calendar" className="text-lg font-medium transition-colors hover:text-tertiary">
            Calendrier
          </Link>
          <Link href="/#contacts" className="text-lg font-medium transition-colors hover:text-tertiary">
            Contacts
          </Link>
        </nav>

        {/* Icônes sociales et connexion à droite */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="#" className="text-muted-foreground text-primary hover:text-tertiary">
            <Facebook className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="#" className="text-muted-foreground text-primary hover:text-tertiary">
            <Instagram className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>

          {loading ? (
            <Button variant="ghost" size="sm" disabled>
              <span className="h-5 w-5 animate-pulse rounded-full bg-muted"></span>
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  <span className="hidden sm:inline-block">{user.email?.split("@")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()}>Tableau de bord</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-6 w-6 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login">
                <LogIn className="text-white h-6 w-6" />
              </Link>
            </Button>
          )}
        </div>

        {/* Menu mobile */}
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
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/presentation"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Présentation
              </Link>
              <Link
                href="/missions"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Missions
              </Link>
              <Link
                href="/calendrier"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Calendrier
              </Link>
              <Link
                href="/contacts"
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Contacts
              </Link>

              <div className="flex items-center gap-4 mt-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>

              {user ? (
                <div className="mt-4 space-y-2">
                  <Link
                    href={getDashboardLink()}
                    className="flex items-center text-base font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Tableau de bord
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Button asChild className="mt-4 w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}