'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { supabase } from './supabase'

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
  addReminder: (date: string, time: string) => Promise<void>
  updateReminder: (id: string, date: string, time: string) => Promise<void>
  deleteReminder: (id: string) => Promise<void>
}

const SESSION_KEY = 'diabesense_current_result'
const ScreeningContext = createContext<ScreeningContextType | undefined>(undefined)

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  const [results, setResults] = useState<ScreeningResult[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [currentResult, setCurrentResultState] = useState<ScreeningResult | null>(null)

  useEffect(() => {
    const savedCurrent = sessionStorage.getItem(SESSION_KEY)
    if (savedCurrent) {
      try { setCurrentResultState(JSON.parse(savedCurrent)) }
      catch { sessionStorage.removeItem(SESSION_KEY) }
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn && user) {
      const savedResults = localStorage.getItem(`diabesense_results_${user.id}`)
      if (savedResults) setResults(JSON.parse(savedResults))
      fetchReminders()
    } else {
      setResults([])
      setReminders([])
    }
  }, [isLoggedIn, user])

  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('date', { ascending: true })

    if (error) { console.error('Fetch reminders error:', error); return }

    setReminders(data.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time,
      isActive: r.is_active,
    })))
  }

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
    if (result) sessionStorage.setItem(SESSION_KEY, JSON.stringify(result))
    else sessionStorage.removeItem(SESSION_KEY)
  }

  const clearCurrentResult = () => {
    setCurrentResultState(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  const updateResultMood = (id: string, mood: string) => {
    if (currentResult?.id === id) {
      const updated = { ...currentResult, mood }
      setCurrentResultState(updated)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    }
    if (isLoggedIn && user) {
      const updatedResults = results.map((r) => r.id === id ? { ...r, mood } : r)
      setResults(updatedResults)
      localStorage.setItem(`diabesense_results_${user.id}`, JSON.stringify(updatedResults))
    }
  }

  const addReminder = async (date: string, time: string) => {
    if (!isLoggedIn || !user) return

    const { data, error } = await supabase
      .from('reminders')
      .insert({ user_id: user.id, date, time, is_active: true })
      .select()
      .single()

    if (error) { console.error('Add reminder error:', error); return }

    setReminders((prev) => [...prev, {
      id: data.id,
      date: data.date,
      time: data.time,
      isActive: data.is_active,
    }])
  }

  const updateReminder = async (id: string, date: string, time: string) => {
    if (!isLoggedIn || !user) return

    const { error } = await supabase
      .from('reminders')
      .update({ date, time })
      .eq('id', id)

    if (error) { console.error('Update reminder error:', error); return }

    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, date, time } : r))
  }

  const deleteReminder = async (id: string) => {
    if (!isLoggedIn || !user) return

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)

    if (error) { console.error('Delete reminder error:', error); return }

    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <ScreeningContext.Provider value={{
      results, reminders, currentResult,
      addResult, setCurrentResult, clearCurrentResult, updateResultMood,
      addReminder, updateReminder, deleteReminder,
    }}>
      {children}
    </ScreeningContext.Provider>
  )
}

export function useScreening() {
  const context = useContext(ScreeningContext)
  if (!context) throw new Error('useScreening must be used within a ScreeningProvider')
  return context
}