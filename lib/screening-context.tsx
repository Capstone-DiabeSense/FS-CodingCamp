'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

export interface ScreeningResult {
  id: string
  date: string
  type: 'basic' | 'comprehensive'
  riskLevel: 'low' | 'medium' | 'high'
  score: number
  answers: Record<string, string | number | boolean>
  mood?: string
}

export interface Reminder {
  id: string
  date: string
  time: string
  isActive: boolean
}

interface ScreeningContextType {
  results: ScreeningResult[]
  reminders: Reminder[]
  currentResult: ScreeningResult | null
  addResult: (result: Omit<ScreeningResult, 'id' | 'date'>) => ScreeningResult
  setCurrentResult: (result: ScreeningResult | null) => void
  clearCurrentResult: () => void
  updateResultMood: (id: string, mood: string) => void
  addReminder: (date: string, time: string) => void
  updateReminder: (id: string, date: string, time: string) => void
  deleteReminder: (id: string) => void
}

const SESSION_KEY = 'diabesense_current_result'

const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined)

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  const [results, setResults] = useState<ScreeningResult[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [currentResult, setCurrentResultState] = useState<ScreeningResult | null>(null)

  // Load data on mount / auth change
  useEffect(() => {
    // Always recover currentResult from sessionStorage (works for logged-in and guest)
    const savedCurrent = sessionStorage.getItem(SESSION_KEY)
    if (savedCurrent) {
      try {
        setCurrentResultState(JSON.parse(savedCurrent))
      } catch {
        sessionStorage.removeItem(SESSION_KEY)
      }
    }

    if (isLoggedIn && user) {
      const savedResults = localStorage.getItem(`diabesense_results_${user.id}`)
      const savedReminders = localStorage.getItem(`diabesense_reminders_${user.id}`)
      if (savedResults) setResults(JSON.parse(savedResults))
      if (savedReminders) setReminders(JSON.parse(savedReminders))
    } else {
      setResults([])
      setReminders([])
    }
  }, [isLoggedIn, user])

  const addResult = (result: Omit<ScreeningResult, 'id' | 'date'>): ScreeningResult => {
    const newResult: ScreeningResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }

    setCurrentResultState(newResult)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newResult))

    if (isLoggedIn && user) {
      const updatedResults = [...results, newResult]
      setResults(updatedResults)
      localStorage.setItem(`diabesense_results_${user.id}`, JSON.stringify(updatedResults))
    }

    return newResult
  }

  const setCurrentResult = (result: ScreeningResult | null) => {
    setCurrentResultState(result)
    if (result) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(result))
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }

  const clearCurrentResult = () => {
    setCurrentResultState(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  const updateResultMood = (id: string, mood: string) => {
    if (currentResult && currentResult.id === id) {
      const updated = { ...currentResult, mood }
      setCurrentResultState(updated)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    }

    if (isLoggedIn && user) {
      const updatedResults = results.map((r) =>
        r.id === id ? { ...r, mood } : r
      )
      setResults(updatedResults)
      localStorage.setItem(`diabesense_results_${user.id}`, JSON.stringify(updatedResults))
    }
  }

  const addReminder = (date: string, time: string) => {
    if (!isLoggedIn || !user) return

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      date,
      time,
      isActive: true,
    }

    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    localStorage.setItem(`diabesense_reminders_${user.id}`, JSON.stringify(updatedReminders))
  }

  const updateReminder = (id: string, date: string, time: string) => {
    if (!isLoggedIn || !user) return

    const updatedReminders = reminders.map((r) =>
      r.id === id ? { ...r, date, time } : r
    )
    setReminders(updatedReminders)
    localStorage.setItem(`diabesense_reminders_${user.id}`, JSON.stringify(updatedReminders))
  }

  const deleteReminder = (id: string) => {
    if (!isLoggedIn || !user) return

    const updatedReminders = reminders.filter((r) => r.id !== id)
    setReminders(updatedReminders)
    localStorage.setItem(`diabesense_reminders_${user.id}`, JSON.stringify(updatedReminders))
  }

  return (
    <ScreeningContext.Provider
      value={{
        results,
        reminders,
        currentResult,
        addResult,
        setCurrentResult,
        clearCurrentResult,
        updateResultMood,
        addReminder,
        updateReminder,
        deleteReminder,
      }}
    >
      {children}
    </ScreeningContext.Provider>
  )
}

export function useScreening() {
  const context = useContext(ScreeningContext)
  if (context === undefined) {
    throw new Error('useScreening must be used within a ScreeningProvider')
  }
  return context
}