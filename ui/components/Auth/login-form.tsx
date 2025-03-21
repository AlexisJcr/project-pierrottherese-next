"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/ui/design-system/Card/card"
import { Label } from "@/ui/design-system/Label/label"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirection après connexion réussie
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      console.error("Erreur de connexion:", err)
      setError(err instanceof Error ? err.message : "Identifiants incorrects. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-gray-500 border-2">
      <CardHeader>
        <CardTitle className="text-primary text-2xl text-center">Connexion</CardTitle>
        <CardDescription className="text-tertiary text-center">Espace Adhérents</CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4 ">
          <div className="space-y-2 text-primary">
            <Label className="text-lg" htmlFor="email">Adresse email</Label>
            <Input
              className="text-black"
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 text-primary">
            <Label className="text-lg" htmlFor="password">Mot de passe</Label>
            <Input
              className="text-black"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full text-white" disabled={loading}>
            {loading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}