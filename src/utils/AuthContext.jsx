import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './SupabaseClient'
const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [supabaseToken, setSupabaseToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    setSupabaseToken(session?.access_token??null)
    setLoading(false)
  }

  getSession()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'SIGNED_IN' && session?.access_token) {
        const accessToken = session.access_token
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }
  )

  return () => subscription.unsubscribe()
}, [])


  const value = {
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    },
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    },

    signOut: async () => {
      await supabase.auth.signOut()

    },
    user,
    loading,
    supabaseToken
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
