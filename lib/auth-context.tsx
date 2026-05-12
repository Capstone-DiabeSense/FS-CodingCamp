'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  height?: number
  weight?: number
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('diabesense_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app would call API
    const users = JSON.parse(localStorage.getItem('diabesense_users') || '[]')
    const foundUser = users.find((u: User & { password: string }) => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password: _, ...userData } = foundUser
      setUser(userData)
      localStorage.setItem('diabesense_user', JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('diabesense_users') || '[]')
    const existingUser = users.find((u: User) => u.email === email)
    
    if (existingUser) {
      return false
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      password,
    }
    
    users.push(newUser)
    localStorage.setItem('diabesense_users', JSON.stringify(users))
    
    const { password: _, ...userData } = newUser
    setUser(userData)
    localStorage.setItem('diabesense_user', JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('diabesense_user')
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('diabesense_user', JSON.stringify(updatedUser))
      
      // Also update in users list
      const users = JSON.parse(localStorage.getItem('diabesense_users') || '[]')
      const userIndex = users.findIndex((u: User) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data }
        localStorage.setItem('diabesense_users', JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, register, logout, updateUser }}>
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
