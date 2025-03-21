import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    console.log('Auth event:', event)
    console.log('Session:', session)
  }
})

// Client Supabase côté client (avec auth-helper)
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClientComponentClient<Database>({ supabaseUrl, supabaseKey })
}

// Client Supabase standard côté serveur (sans auth-helper)
export const createStandardSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Type pour les sections de contenu
export type ContentSection = {
  id: string
  section_key: string
  title: string
  content: string
  image_url: string
  created_at: string
  updated_at: string
}

// Types pour les profils utilisateurs
export type UserRole = "admin" | "adherent"

export type UserProfile = {
  id: string
  first_name: string | null
  last_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserWithEmail = UserProfile & {
  email: string
}

// Type pour les événements
export type Event = {
  id: string
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  image_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

// Type pour les missions
export type MissionBox = {
  id: string
  title: string
  content: string
  image_url: string
  position: number
  created_at: string
  updated_at: string
}

// Type pour les informations de contact
export type ContactInfo = {
  id: string
  label: string
  value: string
  position: number
  created_at: string
  updated_at: string
}

// Type pour les liens sociaux
export type SocialLink = {
  id: string
  platform: string
  url: string
  created_at: string
  updated_at: string
}

