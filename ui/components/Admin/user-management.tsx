"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createSupabaseClient, type UserWithEmail } from "@/lib/supabase-client"
import { Button } from "@/ui/design-system/Button/button"
import { Card, CardContent } from "@/ui/design-system/Card/card"
import { Pencil, Trash2 } from "lucide-react"

export function UserManagement() {
  const [users, setUsers] = useState<UserWithEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseClient()

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)

        // Récupérer les utilisateurs depuis Supabase Auth
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

        if (authError) throw authError

        if (!authUsers.users.length) {
          setUsers([])
          return
        }

        // Récupérer les profils correspondants
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .in(
            "id",
            authUsers.users.map((user) => user.id),
          )

        if (profilesError) throw profilesError

        // Combiner les données des utilisateurs et des profils
        const combinedUsers = authUsers.users.map((authUser) => {
          const profile = profiles?.find((p) => p.id === authUser.id)
          return {
            id: authUser.id,
            email: authUser.email || "",
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            role: profile?.role || "adherent",
            created_at: profile?.created_at || authUser.created_at,
            updated_at: profile?.updated_at || authUser.updated_at,
          }
        })

        setUsers(combinedUsers)
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err)
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [supabase])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter((user) => user.id !== userId))
    } catch (err) {
      console.error("Erreur lors de la suppression:", err)
      alert("Erreur lors de la suppression de l'utilisateur")
    }
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des utilisateurs...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>
  }

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <div className="text-center py-8">Aucun utilisateur trouvé</div>
      ) : (
        users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "Utilisateur sans nom"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs mt-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Administrateur" : "Adhérent"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/users/edit/${user.id}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Modifier</span>
                    </Link>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}