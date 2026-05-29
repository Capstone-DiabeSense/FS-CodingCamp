'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  height?: number
  weight?: number
  gender?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function profileFromAuthUser(supabaseUser: SupabaseUser): Omit<User, 'age' | 'height' | 'weight' | 'gender'> {
  const metadata = supabaseUser.user_metadata ?? {}
  return {
    id: supabaseUser.id,
    name: metadata.name ?? supabaseUser.email?.split('@')[0] ?? 'User',
    email: supabaseUser.email ?? '',
    phone: metadata.phone ?? '',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle()

    if (data) {
      setUser(data)
      setIsLoading(false)
      return
    }

    const profile = profileFromAuthUser(supabaseUser)
    const { data: created, error } = await supabase
      .from('users')
      .insert(profile)
      .select('*')
      .single()

    if (created) {
      setUser(created)
    } else if (error) {
      console.error('[auth] profile fallback failed:', error.message)
      setUser(profile)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return !error
  }

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })
    if (error || !data.user) return false

    const { error: profileError } = await supabase.from('users').insert({
      id: data.user.id,
      name,
      email,
      phone,
    })

    if (profileError && !profileError.message.includes('duplicate key')) {
      console.error('[auth] register profile insert failed:', profileError.message)
      return false
    }

    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const updateUser = async (data: Partial<User>) => {
    if (!user) return
    await supabase.from('users').update(data).eq('id', user.id)
    setUser({ ...user, ...data })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
