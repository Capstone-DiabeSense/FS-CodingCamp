import type { User } from '@/lib/auth-context'
import type { ScreeningResult } from '@/lib/screening-context'
import type { ScreeningFormState } from '@/lib/types/ml-screening'
import { initialFormState } from '@/lib/screening/payload'

/** Map profile age (years) to BRFSS age group bucket 1–13 */
export function ageYearsToAgeGroup(age: number): string {
  if (age < 25) return '1'
  if (age < 30) return '2'
  if (age < 35) return '3'
  if (age < 40) return '4'
  if (age < 45) return '5'
  if (age < 50) return '6'
  if (age < 55) return '7'
  if (age < 60) return '8'
  if (age < 65) return '9'
  if (age < 70) return '10'
  if (age < 75) return '11'
  if (age < 80) return '12'
  return '13'
}

function latestScreeningForm(results: ScreeningResult[]): Partial<ScreeningFormState> | null {
  if (results.length === 0) return null
  const sorted = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  const latest = sorted[0]
  const form = latest?.answers?.form
  if (!form || typeof form !== 'object') return null
  return form as Partial<ScreeningFormState>
}

export function buildPrefillForm(
  user: User | null,
  results: ScreeningResult[],
): ScreeningFormState {
  const base: ScreeningFormState = { ...initialFormState }
  const fromHistory = latestScreeningForm(results)

  if (fromHistory) {
    for (const key of Object.keys(initialFormState) as (keyof ScreeningFormState)[]) {
      const value = fromHistory[key]
      if (value !== undefined && value !== '') {
        base[key] = String(value)
      }
    }
  }

  if (user) {
    if (user.weight) base.weight = user.weight.toString()
    if (user.height) base.height = user.height.toString()
    if (user.age) base.ageGroup = ageYearsToAgeGroup(user.age)
  }

  return base
}
