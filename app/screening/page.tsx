'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useScreening } from '@/lib/screening-context'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MainLayout } from '@/components/main-layout'
import {
  AGE_GROUPS,
  BINARY_OPTIONS,
  DEFAULT_DISCLAIMER,
  FIELD_LABELS,
  GENHLTH_OPTIONS,
  INCOME_BRACKETS,
} from '@/lib/screening/constants'
import {
  buildBasicPayload,
  buildComprehensivePayload,
  calculateBMI,
  initialFormState,
  mapRiskCategoryToLevel,
} from '@/lib/screening/payload'
import { getFieldsForStep, getStepTitles, validateStepFields } from '@/lib/screening/validation'
import type { ScreeningFormState } from '@/lib/types/ml-screening'
import { ClipboardList, ClipboardCheck, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

type ScreeningType = 'basic' | 'comprehensive' | null

function ScreeningContent() {
  const router = useRouter()
  const { addResult } = useScreening()
  const { isLoggedIn } = useAuth()
  const [screeningType, setScreeningType] = useState<ScreeningType>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ScreeningFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const stepTitles = screeningType ? getStepTitles(screeningType) : []
  const steps = stepTitles.map((title, index) => ({
    title,
    fields: getFieldsForStep(screeningType!, index),
  }))

  const bmiPreview = useMemo(() => {
    const w = Number(formData.weight)
    const h = Number(formData.height)
    if (!w || !h || isNaN(w) || isNaN(h)) return null
    return calculateBMI(w, h)
  }, [formData.weight, formData.height])

  const updateField = (field: keyof ScreeningFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
    setSubmitError(null)
  }

  const validateStep = () => {
    const fields = steps[currentStep]?.fields ?? []
    const newErrors = validateStepFields(fields, formData)
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => setCurrentStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!validateStep() || !screeningType) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const payload =
        screeningType === 'basic'
          ? buildBasicPayload(formData)
          : buildComprehensivePayload(formData)

      const headers: Record<string, string> = { 'Content-Type': 'application/json' }

      if (screeningType === 'comprehensive') {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setSubmitError('Login diperlukan untuk skrining komprehensif.')
          setIsSubmitting(false)
          return
        }
        headers.Authorization = `Bearer ${session.access_token}`
      }

      const endpoint =
        screeningType === 'basic' ? '/api/screening/basic' : '/api/screening/comprehensive'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors)
        setSubmitError(data.message ?? 'Terjadi kesalahan. Silakan coba lagi.')
        return
      }

      const probability = data.probability as number
      const riskCategory = data.risk_category as 'rendah' | 'sedang' | 'tinggi'

      addResult({
        type: screeningType,
        riskLevel: mapRiskCategoryToLevel(riskCategory),
        riskCategory,
        score: Math.round(probability * 100),
        probability,
        mode: data.mode ?? screeningType,
        thresholdUsed: data.threshold_used,
        disclaimer: data.disclaimer ?? DEFAULT_DISCLAIMER,
        answers: { form: { ...formData }, payload },
      })

      router.push('/screening/result')
    } catch {
      setSubmitError('Gagal menghubungi server. Periksa koneksi internet Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSelectField = (
    field: keyof ScreeningFormState,
    options: { value: string; label: string }[],
    placeholder: string,
  ) => (
    <div className="space-y-2">
      <Label>{FIELD_LABELS[field] ?? field}</Label>
      <Select value={formData[field]} onValueChange={(v) => updateField(field, v)}>
        <SelectTrigger className={`w-full ${errors[field] ? 'border-destructive' : ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[field] && <p className="text-sm text-destructive">{errors[field]}</p>}
    </div>
  )

  const renderBinaryField = (field: keyof ScreeningFormState, question: string) => (
    <div className="space-y-2">
      <Label>{question}</Label>
      <RadioGroup
        value={formData[field]}
        onValueChange={(v) => updateField(field, v)}
        className="space-y-2"
      >
        {BINARY_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.value} id={`${field}-${opt.value}`} />
            <Label htmlFor={`${field}-${opt.value}`} className="cursor-pointer">
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {errors[field] && <p className="text-sm text-destructive">{errors[field]}</p>}
    </div>
  )

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      case 'ageGroup':
        return renderSelectField('ageGroup', AGE_GROUPS, 'Pilih kelompok usia')
      case 'weight':
        return (
          <div className="space-y-2">
            <Label htmlFor="weight">Berat Badan (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Masukkan berat badan"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              className={errors.weight ? 'border-destructive' : ''}
            />
            {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
          </div>
        )
      case 'height':
        return (
          <div className="space-y-2">
            <Label htmlFor="height">Tinggi Badan (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="Masukkan tinggi badan"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
              className={errors.height ? 'border-destructive' : ''}
            />
            {bmiPreview !== null && (
              <p className="text-xs text-muted-foreground">
                BMI: <span className="font-mono">{bmiPreview}</span>
              </p>
            )}
            {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
          </div>
        )
      case 'highBP':
        return renderBinaryField('highBP', 'Apakah Anda pernah diberitahu memiliki tekanan darah tinggi?')
      case 'genHlth':
        return renderSelectField('genHlth', GENHLTH_OPTIONS, 'Pilih kondisi kesehatan umum')
      case 'physActivity':
        return renderBinaryField(
          'physActivity',
          'Apakah Anda melakukan aktivitas fisik dalam 30 hari terakhir?',
        )
      case 'diffWalk':
        return renderBinaryField('diffWalk', 'Apakah Anda mengalami kesulitan berjalan atau naik tangga?')
      case 'smoker':
        return renderBinaryField(
          'smoker',
          'Apakah Anda pernah merokok ≥100 batang sepanjang hidup?',
        )
      case 'highChol':
        return renderBinaryField('highChol', 'Apakah Anda pernah diberitahu memiliki kolesterol tinggi?')
      case 'stroke':
        return renderBinaryField('stroke', 'Apakah Anda pernah mengalami stroke?')
      case 'heartDisease':
        return renderBinaryField(
          'heartDisease',
          'Apakah Anda pernah didiagnosis penyakit jantung atau serangan jantung?',
        )
      case 'veggies':
        return renderBinaryField('veggies', 'Apakah Anda mengonsumsi sayur ≥1 kali per hari?')
      case 'hvyAlcohol':
        return renderBinaryField(
          'hvyAlcohol',
          'Apakah Anda mengonsumsi alkohol berat (pria >14 gelas/minggu, wanita >7 gelas/minggu)?',
        )
      case 'mentHlth':
        return (
          <div className="space-y-2">
            <Label htmlFor="mentHlth">Hari kesehatan mental buruk (30 hari terakhir)</Label>
            <Input
              id="mentHlth"
              type="number"
              min={0}
              max={30}
              placeholder="0–30 hari"
              value={formData.mentHlth}
              onChange={(e) => updateField('mentHlth', e.target.value)}
              className={errors.mentHlth ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">
              Berapa hari kesehatan mental Anda kurang baik (stress, depresi, dll)?
            </p>
            {errors.mentHlth && <p className="text-sm text-destructive">{errors.mentHlth}</p>}
          </div>
        )
      case 'physHlth':
        return (
          <div className="space-y-2">
            <Label htmlFor="physHlth">Hari kesehatan fisik buruk (30 hari terakhir)</Label>
            <Input
              id="physHlth"
              type="number"
              min={0}
              max={30}
              placeholder="0–30 hari"
              value={formData.physHlth}
              onChange={(e) => updateField('physHlth', e.target.value)}
              className={errors.physHlth ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">
              Berapa hari kesehatan fisik Anda kurang baik (sakit, cedera, dll)?
            </p>
            {errors.physHlth && <p className="text-sm text-destructive">{errors.physHlth}</p>}
          </div>
        )
      case 'income':
        return renderSelectField('income', INCOME_BRACKETS, 'Pilih tingkat penghasilan')
      case 'noDocbcCost':
        return renderBinaryField(
          'noDocbcCost',
          'Apakah ada waktu Anda tidak bisa periksa ke dokter karena biaya?',
        )
      default:
        return null
    }
  }

  if (!screeningType) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Pilih Jenis Skrining
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Pilih jenis skrining yang sesuai dengan kebutuhan Anda
            </p>
          </div>

          <div className="mx-auto max-w-2xl grid gap-6 md:grid-cols-2">
            <Card
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              onClick={() => setScreeningType('basic')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Skrining Dasar</CardTitle>
                <CardDescription>
                  7 indikator risiko — tersedia untuk semua pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Usia, BMI, tekanan darah
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Aktivitas fisik & merokok
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Persepsi kesehatan umum
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Waktu: sekitar 3 menit
                  </li>
                </ul>
                <Button className="w-full mt-6 font-mono">Pilih Skrining Dasar</Button>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all hover:border-primary hover:shadow-lg ${!isLoggedIn ? 'opacity-90' : ''}`}
              onClick={() => {
                if (!isLoggedIn) {
                  router.push('/login')
                  return
                }
                setScreeningType('comprehensive')
              }}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Skrining Komprehensif</CardTitle>
                <CardDescription>
                  16 indikator risiko — memerlukan login
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Semua indikator skrining dasar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Riwayat stroke, jantung, kolesterol
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Kesehatan mental, fisik & penghasilan
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Waktu: sekitar 5 menit
                  </li>
                </ul>
                <Button className="w-full mt-6 font-mono">
                  {isLoggedIn ? 'Pilih Skrining Komprehensif' : 'Login untuk Akses'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span className="font-mono">
                Langkah {currentStep + 1} dari {steps.length}
              </span>
              <span className="font-mono">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">{steps[currentStep]?.title}</CardTitle>
              <CardDescription>
                {screeningType === 'comprehensive' ? 'Skrining Komprehensif' : 'Skrining Dasar'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {submitError && (
                <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              {steps[currentStep]?.fields.map((field) => (
                <div key={field}>{renderField(field)}</div>
              ))}

              <div className="flex gap-4 pt-4">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handleBack} className="font-mono">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                )}

                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext} className="ml-auto font-mono">
                    Lanjut
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="ml-auto font-mono"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghitung risiko…
                      </>
                    ) : (
                      'Cek Risiko Saya'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            className="mt-4 font-mono"
            onClick={() => {
              setScreeningType(null)
              setCurrentStep(0)
              setFormData(initialFormState)
              setErrors({})
              setSubmitError(null)
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Pilih jenis skrining lain
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ScreeningPage() {
  return <ScreeningContent />
}
