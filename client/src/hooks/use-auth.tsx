import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from '@supabase/supabase-js'
import { supabase, signIn as supabaseSignIn, signOut as supabaseSignOut, getSession } from "@/lib/supabase"
import { useLocation } from "wouter"

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: ({ email, password }: { email: string; password: string }) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [, setLocation] = useLocation()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { session } = await getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true)
    try {
      const { data, error } = await supabaseSignIn({ email, password })
      if (error) throw error

      // Update auth state before navigation
      if (data?.user) {
        setUser(data.user)
        setSession(data.session)
        setLocation("/app")
      }
      
      return { data, error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabaseSignOut()
      if (error) throw error
      
      // Clear auth state
      setUser(null)
      setSession(null)
      
      // Navigate after state is cleared
      setLocation("/auth")
      return { error: null }
    } catch (error) {
      console.error("Sign out error:", error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}