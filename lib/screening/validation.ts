import { calculateBMI } from '@/lib/screening/payload'
import { FIELD_LABELS } from '@/lib/screening/constants'
import type { ScreeningFormState } from '@/lib/types/ml-screening'

const BASIC_FIELDS = ['ageGroup', 'weight', 'height', 'highBP', 'genHlth', 'physActivity', 'diffWalk', 'smoker'] as const

const COMPREHENSIVE_ONLY_FIELDS = [
  'highChol',
  'stroke',
  'heartDisease',
  'veggies',
  'hvyAlcohol',
  'mentHlth',
  'physHlth',
  'income',
  'noDocbcCost',
] as const

export function getFieldsForStep(
  screeningType: 'basic' | 'comprehensive',
  stepIndex: number,
): string[] {
  const basicSteps: string[][] = [
    ['ageGroup', 'weight', 'height'],
    ['highBP', 'genHlth', 'diffWalk'],
    ['physActivity', 'smoker'],
  ]

  const comprehensiveSteps: string[][] = [
    ['ageGroup', 'weight', 'height'],
    ['highBP', 'highChol', 'stroke', 'heartDisease', 'diffWalk'],
    ['smoker', 'physActivity', 'veggies', 'hvyAlcohol'],
    ['genHlth', 'mentHlth', 'physHlth', 'income', 'noDocbcCost'],
  ]

  const steps = screeningType === 'comprehensive' ? comprehensiveSteps : basicSteps
  return steps[stepIndex] ?? []
}

export function getStepTitles(screeningType: 'basic' | 'comprehensive'): string[] {
  if (screeningType === 'comprehensive') {
    return ['Data Fisik', 'Riwayat Medis', 'Gaya Hidup', 'Kesehatan & Sosial']
  }
  return ['Data Fisik', 'Kesehatan', 'Gaya Hidup']
}

function validateBinary(value: string, field: string, errors: Record<string, string>) {
  if (!value && value !== '0') {
    errors[field] = `${FIELD_LABELS[field] ?? field} wajib diisi`
    return
  }
  if (value !== '0' && value !== '1') {
    errors[field] = `${FIELD_LABELS[field] ?? field} harus Ya atau Tidak`
  }
}

function validateRange(
  value: string,
  field: string,
  min: number,
  max: number,
  errors: Record<string, string>,
) {
  if (!value && value !== '0') {
    errors[field] = `${FIELD_LABELS[field] ?? field} wajib diisi`
    return
  }
  const num = Number(value)
  if (isNaN(num) || num < min || num > max) {
    errors[field] = `${FIELD_LABELS[field] ?? field} harus antara ${min}–${max}`
  }
}

export function validateStepFields(
  fields: string[],
  form: ScreeningFormState,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    switch (field) {
      case 'ageGroup':
        validateRange(form.ageGroup, field, 1, 13, errors)
        break
      case 'weight':
        if (!form.weight) {
          errors.weight = 'Berat badan wajib diisi'
        } else if (isNaN(Number(form.weight)) || Number(form.weight) < 20 || Number(form.weight) > 300) {
          errors.weight = 'Berat badan harus antara 20–300 kg'
        }
        break
      case 'height':
        if (!form.height) {
          errors.height = 'Tinggi badan wajib diisi'
        } else if (isNaN(Number(form.height)) || Number(form.height) < 50 || Number(form.height) > 250) {
          errors.height = 'Tinggi badan harus antara 50–250 cm'
        }
        break
      case 'genHlth':
        validateRange(form.genHlth, field, 1, 5, errors)
        break
      case 'mentHlth':
      case 'physHlth':
        validateRange(form[field], field, 0, 30, errors)
        break
      case 'income':
        validateRange(form.income, field, 1, 8, errors)
        break
      case 'highBP':
      case 'physActivity':
      case 'diffWalk':
      case 'smoker':
      case 'highChol':
      case 'stroke':
      case 'heartDisease':
      case 'veggies':
      case 'hvyAlcohol':
      case 'noDocbcCost':
        validateBinary(form[field as keyof ScreeningFormState] as string, field, errors)
        break
      default:
        break
    }
  }

  if (fields.includes('weight') && fields.includes('height') && !errors.weight && !errors.height) {
    const bmi = calculateBMI(Number(form.weight), Number(form.height))
    if (bmi < 10 || bmi > 80) {
      errors.weight = `BMI hasil perhitungan (${bmi}) harus antara 10–80. Periksa berat dan tinggi badan.`
    }
  }

  return errors
}

export { BASIC_FIELDS, COMPREHENSIVE_ONLY_FIELDS }
