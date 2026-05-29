'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScreening } from '@/lib/screening-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { ClipboardList, ClipboardCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type ScreeningType = 'basic' | 'comprehensive' | null

// Field names match API contract exactly
interface FormData {
  // Shared: basic & comprehensive (7 fields)
  Age: string         
  weight: string      
  height: string      
  HighBP: string      
  GenHlth: string     
  PhysActivity: string 
  DiffWalk: string    
  Smoker: string      
  // Comprehensive (9 additional fields)
  HighChol: string         
  Stroke: string           
  HeartDiseaseorAttack: string 
  Veggies: string          
  HvyAlcoholConsump: string 
  MentHlth: string         
  PhysHlth: string         
  Income: string           
  NoDocbcCost: string      
}

// Age group labels 
const AGE_GROUPS = [
  { value: '1', label: '18–24 tahun' },
  { value: '2', label: '25–29 tahun' },
  { value: '3', label: '30–34 tahun' },
  { value: '4', label: '35–39 tahun' },
  { value: '5', label: '40–44 tahun' },
  { value: '6', label: '45–49 tahun' },
  { value: '7', label: '50–54 tahun' },
  { value: '8', label: '55–59 tahun' },
  { value: '9', label: '60–64 tahun' },
  { value: '10', label: '65–69 tahun' },
  { value: '11', label: '70–74 tahun' },
  { value: '12', label: '75–79 tahun' },
  { value: '13', label: '80 tahun ke atas' },
]

const INCOME_GROUPS = [
  { value: '1', label: 'Kurang dari Rp 1 juta/bulan' },
  { value: '2', label: 'Rp 1 – 2 juta/bulan' },
  { value: '3', label: 'Rp 2 – 3 juta/bulan' },
  { value: '4', label: 'Rp 3 – 5 juta/bulan' },
  { value: '5', label: 'Rp 5 – 7,5 juta/bulan' },
  { value: '6', label: 'Rp 7,5 – 10 juta/bulan' },
  { value: '7', label: 'Rp 10 – 15 juta/bulan' },
  { value: '8', label: 'Lebih dari Rp 15 juta/bulan' },
]

// Basic: 3 steps | Comprehensive: 4 steps
const basicSteps = [
  {
    title: 'Data Diri',
    fields: ['Age', 'weight', 'height'],
  },
  {
    title: 'Kondisi Kesehatan',
    fields: ['HighBP', 'GenHlth', 'DiffWalk'],
  },
  {
    title: 'Gaya Hidup',
    fields: ['PhysActivity', 'Smoker'],
  },
]

const comprehensiveSteps = [
  ...basicSteps,
  {
    title: 'Data Tambahan',
    fields: [
      'HighChol', 'Stroke', 'HeartDiseaseorAttack',
      'Veggies', 'HvyAlcoholConsump', 'NoDocbcCost',
      'MentHlth', 'PhysHlth', 'Income',
    ],
  },
]

function ScreeningContent() {
  const router = useRouter()
  const { addResult } = useScreening()
  const { user, isLoggedIn } = useAuth()
  const [screeningType, setScreeningType] = useState<ScreeningType>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    Age: '',
    weight: '',
    height: '',
    HighBP: '',
    GenHlth: '',
    PhysActivity: '',
    DiffWalk: '',
    Smoker: '',
    HighChol: '',
    Stroke: '',
    HeartDiseaseorAttack: '',
    Veggies: '',
    HvyAlcoholConsump: '',
    MentHlth: '',
    PhysHlth: '',
    Income: '',
    NoDocbcCost: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-fill weight & height from user profile 
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        weight: user?.weight?.toString() || '',
        height: user?.height?.toString() || '',
      }))
    }
  }, [user])

  const steps = screeningType === 'comprehensive' ? comprehensiveSteps : basicSteps

  // Calculate BMI 
  const calculateBMI = (): number | null => {
    const w = Number(formData.weight)
    const h = Number(formData.height) / 100
    if (!w || !h) return null
    const bmi = w / (h * h)
    return Math.round(bmi * 10) / 10
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    const currentFields = steps[currentStep]?.fields || []

    currentFields.forEach((field) => {
      const val = formData[field as keyof FormData]
      if (val === '' || val === undefined) {
        newErrors[field] = 'Wajib diisi'
      }
    })

    // Weight & height range validation
    if (currentFields.includes('weight') && formData.weight) {
      const w = Number(formData.weight)
      if (isNaN(w) || w < 20 || w > 300) newErrors.weight = 'Berat badan harus antara 20–300 kg'
    }
    if (currentFields.includes('height') && formData.height) {
      const h = Number(formData.height)
      if (isNaN(h) || h < 50 || h > 250) newErrors.height = 'Tinggi badan harus antara 50–250 cm'
    }

    // BMI range check (derived from weight & height)
    if (currentFields.includes('weight') || currentFields.includes('height')) {
      const bmi = calculateBMI()
      if (bmi !== null && (bmi < 10 || bmi > 80)) {
        newErrors.weight = 'BMI yang dihasilkan di luar rentang valid (10–80). Periksa kembali berat dan tinggi.'
      }
    }

    // MentHlth & PhysHlth range
    if (currentFields.includes('MentHlth') && formData.MentHlth !== '') {
      const v = Number(formData.MentHlth)
      if (isNaN(v) || v < 0 || v > 30) newErrors.MentHlth = 'Harus antara 0–30 hari'
    }
    if (currentFields.includes('PhysHlth') && formData.PhysHlth !== '') {
      const v = Number(formData.PhysHlth)
      if (isNaN(v) || v < 0 || v > 30) newErrors.PhysHlth = 'Harus antara 0–30 hari'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    if (!validateStep()) return
    setIsSubmitting(true)

    const bmi = calculateBMI() ?? 0

    // Build API payload 
    const basicPayload = {
      Age: Number(formData.Age),
      BMI: bmi,
      HighBP: Number(formData.HighBP),
      GenHlth: Number(formData.GenHlth),
      PhysActivity: Number(formData.PhysActivity),
      DiffWalk: Number(formData.DiffWalk),
      Smoker: Number(formData.Smoker),
    }

    const comprehensivePayload = {
      ...basicPayload,
      HighChol: Number(formData.HighChol),
      Stroke: Number(formData.Stroke),
      HeartDiseaseorAttack: Number(formData.HeartDiseaseorAttack),
      Veggies: Number(formData.Veggies),
      HvyAlcoholConsump: Number(formData.HvyAlcoholConsump),
      MentHlth: Number(formData.MentHlth),
      PhysHlth: Number(formData.PhysHlth),
      Income: Number(formData.Income),
      NoDocbcCost: Number(formData.NoDocbcCost),
    }

    const payload = screeningType === 'comprehensive' ? comprehensivePayload : basicPayload

    console.log('Payload siap dikirim ke backend:', payload)

    setTimeout(() => {
      addResult({
        type: screeningType as 'basic' | 'comprehensive',
        riskLevel: 'medium',   
        score: 50,             
        answers: payload as unknown as Record<string, string | number | boolean>,
      })
      router.push('/screening/result')
    }, 1500)
  }

  const resetForm = () => {
    setScreeningType(null)
    setCurrentStep(0)
    setFormData({
      Age: '',
      weight: user?.weight?.toString() || '',
      height: user?.height?.toString() || '',
      HighBP: '',
      GenHlth: '',
      PhysActivity: '',
      DiffWalk: '',
      Smoker: '',
      HighChol: '',
      Stroke: '',
      HeartDiseaseorAttack: '',
      Veggies: '',
      HvyAlcoholConsump: '',
      MentHlth: '',
      PhysHlth: '',
      Income: '',
      NoDocbcCost: '',
    })
    setErrors({})
  }

  // Field renderers

  const renderYesNo = (field: keyof FormData, label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup
        value={formData[field]}
        onValueChange={(value) => setFormData({ ...formData, [field]: value })}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${field}-yes`} />
          <Label htmlFor={`${field}-yes`} className="cursor-pointer">Ya</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="0" id={`${field}-no`} />
          <Label htmlFor={`${field}-no`} className="cursor-pointer">Tidak</Label>
        </div>
      </RadioGroup>
      {errors[field] && <p className="text-sm text-destructive">{errors[field]}</p>}
    </div>
  )

  const renderNumberInput = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    hint?: string,
    step?: string
  ) => (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        type="number"
        step={step}
        placeholder={placeholder}
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className={errors[field] ? 'border-destructive' : ''}
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {errors[field] && <p className="text-sm text-destructive">{errors[field]}</p>}
    </div>
  )

  const renderField = (fieldName: string) => {
    switch (fieldName) {
      // Age dropdown
      case 'Age':
        return (
          <div className="space-y-2">
            <Label htmlFor="Age">Kelompok Umur</Label>
            <Select
              value={formData.Age}
              onValueChange={(value) => setFormData({ ...formData, Age: value })}
            >
              <SelectTrigger id="Age" className={errors.Age ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih kelompok umur" />
              </SelectTrigger>
              <SelectContent>
                {AGE_GROUPS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.Age && <p className="text-sm text-destructive">{errors.Age}</p>}
          </div>
        )

      // Weight & height
      case 'weight':
        return renderNumberInput('weight', 'Berat Badan (kg)', 'Contoh: 65', 'Digunakan untuk menghitung BMI')
      case 'height':
        return (
          <div className="space-y-2">
            {renderNumberInput('height', 'Tinggi Badan (cm)', 'Contoh: 165', 'Digunakan untuk menghitung BMI')}
            {/* Show live BMI preview once both fields filled */}
            {formData.weight && formData.height && (() => {
              const bmi = calculateBMI()
              if (!bmi) return null
              const category =
                bmi < 18.5 ? 'Berat badan kurang' :
                bmi < 25 ? 'Normal' :
                bmi < 30 ? 'Kelebihan berat badan' : 'Obesitas'
              return (
                <p className="text-sm text-muted-foreground">
                  BMI Anda: <span className="font-medium text-foreground">{bmi}</span> — {category}
                </p>
              )
            })()}
          </div>
        )

      // Yes/No fields
      case 'HighBP':
        return renderYesNo('HighBP', 'Apakah Anda memiliki tekanan darah tinggi?')
      case 'PhysActivity':
        return renderYesNo('PhysActivity', 'Apakah Anda aktif berolahraga? (minimal 30 menit, 3x seminggu)')
      case 'DiffWalk':
        return renderYesNo('DiffWalk', 'Apakah Anda mengalami kesulitan berjalan atau menaiki tangga?')
      case 'Smoker':
        return renderYesNo('Smoker', 'Apakah Anda perokok? (atau pernah merokok ≥100 batang seumur hidup)')
      case 'HighChol':
        return renderYesNo('HighChol', 'Apakah Anda memiliki kolesterol tinggi?')
      case 'Stroke':
        return renderYesNo('Stroke', 'Apakah Anda pernah mengalami stroke?')
      case 'HeartDiseaseorAttack':
        return renderYesNo('HeartDiseaseorAttack', 'Apakah Anda pernah mengalami penyakit jantung atau serangan jantung?')
      case 'Veggies':
        return renderYesNo('Veggies', 'Apakah Anda mengonsumsi sayuran setiap hari?')
      case 'HvyAlcoholConsump':
        return renderYesNo('HvyAlcoholConsump', 'Apakah Anda mengonsumsi alkohol berat? (pria >14 gelas/minggu, wanita >7 gelas/minggu)')
      case 'NoDocbcCost':
        return renderYesNo('NoDocbcCost', 'Apakah Anda pernah melewatkan kunjungan dokter karena biaya?')

      // GenHlth
      case 'GenHlth':
        return (
          <div className="space-y-2">
            <Label>Bagaimana kondisi kesehatan umum Anda secara keseluruhan?</Label>
            <RadioGroup
              value={formData.GenHlth}
              onValueChange={(value) => setFormData({ ...formData, GenHlth: value })}
              className="space-y-2"
            >
              {[
                { value: '1', label: 'Sangat Baik' },
                { value: '2', label: 'Baik' },
                { value: '3', label: 'Cukup' },
                { value: '4', label: 'Buruk' },
                { value: '5', label: 'Sangat Buruk' },
              ].map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value} id={`genhlth-${opt.value}`} />
                  <Label htmlFor={`genhlth-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors.GenHlth && <p className="text-sm text-destructive">{errors.GenHlth}</p>}
          </div>
        )

      // MentHlth & PhysHlth
      case 'MentHlth':
        return renderNumberInput(
          'MentHlth',
          'Berapa hari kesehatan mental Anda buruk dalam 30 hari terakhir?',
          'Masukkan angka 0–30',
          'Contoh: stres, depresi, atau masalah emosional'
        )
      case 'PhysHlth':
        return renderNumberInput(
          'PhysHlth',
          'Berapa hari kesehatan fisik Anda buruk dalam 30 hari terakhir?',
          'Masukkan angka 0–30',
          'Contoh: sakit, cedera, atau tidak fit secara fisik'
        )

      // Income dropdown
      case 'Income':
        return (
          <div className="space-y-2">
            <Label htmlFor="Income">Kategori Pendapatan</Label>
            <Select
              value={formData.Income}
              onValueChange={(value) => setFormData({ ...formData, Income: value })}
            >
              <SelectTrigger id="Income" className={errors.Income ? 'border-destructive' : ''}>
                <SelectValue placeholder="Pilih kategori pendapatan" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_GROUPS.map((g) => (
                  <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.Income && <p className="text-sm text-destructive">{errors.Income}</p>}
          </div>
        )

      default:
        return null
    }
  }

  // Type selection screen
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
            {/* Basic */}
            <Card
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              onClick={() => setScreeningType('basic')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardList className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Skrining Dasar</CardTitle>
                <CardDescription>Penilaian risiko berdasarkan data dasar dan gaya hidup</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {['Kelompok umur & BMI', 'Tekanan darah & persepsi kesehatan', 'Aktivitas fisik & kebiasaan merokok', 'Waktu: sekitar 3 menit'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 font-mono"
                  onClick={(e) => { e.stopPropagation(); setScreeningType('basic') }}
                >
                  Pilih Skrining Dasar
                </Button>
              </CardContent>
            </Card>

            {/* Comprehensive */}
            <Card
              className={`transition-all hover:shadow-lg ${isLoggedIn ? 'cursor-pointer hover:border-primary' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => isLoggedIn && setScreeningType('comprehensive')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Skrining Komprehensif</CardTitle>
                <CardDescription>
                  {isLoggedIn
                    ? 'Penilaian lengkap dengan 16 faktor risiko'
                    : 'Login diperlukan untuk skrining komprehensif'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {['Semua data skrining dasar', 'Riwayat stroke & penyakit jantung', 'Konsumsi sayur, alkohol, kolesterol', 'Kondisi mental & fisik 30 hari terakhir', 'Waktu: sekitar 5 menit'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full mt-6 font-mono"
                  disabled={!isLoggedIn}
                  onClick={(e) => { e.stopPropagation(); if (isLoggedIn) setScreeningType('comprehensive') }}
                >
                  {isLoggedIn ? 'Pilih Skrining Komprehensif' : 'Login untuk Akses'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Multi-step form
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span className="font-mono">Langkah {currentStep + 1} dari {steps.length}</span>
              <span className="font-mono">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
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
                  <Button onClick={handleSubmit} className="ml-auto font-mono" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghitung...
                      </>
                    ) : (
                      'Cek Risiko Saya'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Button variant="ghost" className="mt-4 font-mono" onClick={resetForm}>
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