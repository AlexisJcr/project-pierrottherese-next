"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient, type UserRole } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Input } from "@/ui/design-system/Input/input"
import { Label } from "@/ui/design-system/Label/label"
import { Card, CardContent, CardFooter } from "@/ui/design-system/Card/card"
import { RadioGroup, RadioGroupItem } from "@/ui/design-system/Radio/radio-group"

interface UserFormProps {
  userId?: string
  initialData?: {
    email: string
    first_name: string
    last_name: string
    role: UserRole
    password: string
  }
}

export function UserForm({ userId, initialData }: UserFormProps) {
  const isEditing = !!userId

  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    role: initialData?.role || ("adherent" as UserRole),
    password: initialData?.password || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      if (isEditing) {
        // Mise à jour d'un utilisateur existant
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            first_name: formData.first_name || null,
            last_name: formData.last_name || null,
            role: formData.role,
          })
          .eq("id", userId)

        if (profileError) throw profileError

        // Mettre à jour l'email si nécessaire
        if (formData.email !== initialData?.email) {
          const { error: updateUserError } = await supabase.auth.admin.updateUserById(userId, { email: formData.email })

          if (updateUserError) throw updateUserError
        }

        // Mettre à jour le mot de passe si fourni
        if (formData.password) {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(userId, {
            password: formData.password,
          })

          if (passwordError) throw passwordError
        }

        setSuccess("Utilisateur mis à jour avec succès")
      } else {
        // Création d'un nouvel utilisateur

        // Vérifier que tous les champs requis sont remplis
        if (!formData.email || !formData.password) {
          throw new Error("L'email et le mot de passe sont requis")
        }

        // Créer l'utilisateur
        const { data: userData, error: createUserError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
        })

        if (createUserError) throw createUserError

        // Mettre à jour le profil avec les informations supplémentaires
        if (userData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              first_name: formData.first_name || null,
              last_name: formData.last_name || null,
              role: formData.role,
            })
            .eq("id", userData.user.id)

          if (profileError) throw profileError
        }

        setSuccess("Utilisateur créé avec succès")

        // Rediriger vers la liste des utilisateurs après un court délai
        setTimeout(() => {
          router.push("/admin/users")
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      console.error("Erreur:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first_name">Prénom</Label>
            <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Nom</Label>
            <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <RadioGroup value={formData.role} onValueChange={handleRoleChange} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="role-admin" />
                <Label htmlFor="role-admin">Administrateur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adherent" id="role-adherent" />
                <Label htmlFor="role-adherent">Adhérent</Label>
              </div>
            </RadioGroup>
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{success}</div>}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}