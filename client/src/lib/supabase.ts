import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL is required')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required')
}

// Initialize the Supabase client with more robust session handling
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: window.localStorage
    },
  }
)

// Helper functions for auth
export const signUp = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  await supabase.auth.signOut() // Clear any existing session first
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    // Clear any stored session data
    window.localStorage.removeItem('supabase.auth.token')
  }
  return { error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const refreshSession = async () => {
  const { data: { session }, error } = await supabase.auth.refreshSession()
  return { session, error }
}

// Subscribe to auth changes
export const onAuthStateChange = (callback: (session: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}