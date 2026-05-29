'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useScreening } from '@/lib/screening-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { ClipboardList, ClipboardCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

type ScreeningType = 'basic' | 'comprehensive' | null

interface FormData {
  age: string
  gender: string
  weight: string
  height: string
  familyHistory: string
  physicalActivity: string
  diet: string
  smoking: string
  bloodPressure: string
  // Comprehensive only
  fastingGlucose?: string
  hba1c?: string
  cholesterol?: string
  waistCircumference?: string
}

function ScreeningContent() {
  const router = useRouter()
  const { addResult } = useScreening()
  const { user } = useAuth()
  const [screeningType, setScreeningType] = useState<ScreeningType>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    familyHistory: '',
    physicalActivity: '',
    diet: '',
    smoking: '',
    bloodPressure: '',
    fastingGlucose: '',
    hba1c: '',
    cholesterol: '',
    waistCircumference: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
  if (user) {
    setFormData(prev => ({
      ...prev,
      age: user?.age?.toString() || '',
      gender: user?.gender || '',
      weight: user?.weight?.toString() || '',
      height: user?.height?.toString() || '',
    }))
  }
}, [user])

  const basicSteps = [
    {
      title: 'Data Dasar',
      fields: ['age', 'gender', 'weight', 'height'],
    },
    {
      title: 'Riwayat Kesehatan',
      fields: ['familyHistory', 'bloodPressure'],
    },
    {
      title: 'Gaya Hidup',
      fields: ['physicalActivity', 'diet', 'smoking'],
    },
  ]

  const comprehensiveSteps = [
    ...basicSteps,
    {
      title: 'Data Laboratorium',
      fields: ['fastingGlucose', 'hba1c', 'cholesterol', 'waistCircumference'],
    },
  ]

  const steps = screeningType === 'comprehensive' ? comprehensiveSteps : basicSteps

  const validateStep = () => {
    const newErrors: Record<string, string> = {}
    const currentFields = steps[currentStep]?.fields || []

    currentFields.forEach((field) => {
      if (!formData[field as keyof FormData]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })

    // Numeric validations
    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120)) {
      newErrors.age = 'Usia harus antara 1-120 tahun'
    }
    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 20 || Number(formData.weight) > 300)) {
      newErrors.weight = 'Berat badan harus antara 20-300 kg'
    }
    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 50 || Number(formData.height) > 250)) {
      newErrors.height = 'Tinggi badan harus antara 50-250 cm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateRisk = (): { level: 'low' | 'medium' | 'high'; score: number } => {
    let score = 0

    // Age scoring
    const age = Number(formData.age)
    if (age >= 45 && age < 55) score += 10
    else if (age >= 55 && age < 65) score += 15
    else if (age >= 65) score += 20

    // BMI scoring
    const weight = Number(formData.weight)
    const height = Number(formData.height) / 100
    const bmi = weight / (height * height)
    if (bmi >= 25 && bmi < 30) score += 15
    else if (bmi >= 30) score += 25

    // Family history
    if (formData.familyHistory === 'yes') score += 15

    // Physical activity
    if (formData.physicalActivity === 'rarely') score += 10
    else if (formData.physicalActivity === 'never') score += 15

    // Diet
    if (formData.diet === 'poor') score += 10
    else if (formData.diet === 'very_poor') score += 15

    // Smoking
    if (formData.smoking === 'yes') score += 10

    // Blood pressure
    if (formData.bloodPressure === 'high') score += 15
    else if (formData.bloodPressure === 'very_high') score += 20

    // Comprehensive screening additional factors
    if (screeningType === 'comprehensive') {
      const fastingGlucose = Number(formData.fastingGlucose)
      if (fastingGlucose >= 100 && fastingGlucose < 126) score += 10
      else if (fastingGlucose >= 126) score += 20

      const hba1c = Number(formData.hba1c)
      if (hba1c >= 5.7 && hba1c < 6.5) score += 10
      else if (hba1c >= 6.5) score += 20
    }

    // Determine risk level
    let level: 'low' | 'medium' | 'high'
    if (score < 30) level = 'low'
    else if (score < 60) level = 'medium'
    else level = 'high'

    return { level, score: Math.min(score, 100) }
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    if (!validateStep()) return

    setIsSubmitting(true)

    setTimeout(() => {
      const { level, score } = calculateRisk()
      
      addResult({
        type: screeningType as 'basic' | 'comprehensive',
        riskLevel: level,
        score,
        answers: formData as unknown as Record<string, string | number | boolean>,
      })

      router.push('/screening/result')
    }, 1500)
  }

  const renderField = (fieldName: string) => {
    const error = errors[fieldName]

    switch (fieldName) {
      case 'age':
        return (
          <div className="space-y-2">
            <Label htmlFor="age">Usia (tahun)</Label>
            <Input
              id="age"
              type="number"
              placeholder="Masukkan usia Anda"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'gender':
        return (
          <div className="space-y-2">
            <Label>Jenis Kelamin</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Perempuan</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'weight':
        return (
          <div className="space-y-2">
            <Label htmlFor="weight">Berat Badan (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Masukkan berat badan"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
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
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'familyHistory':
        return (
          <div className="space-y-2">
            <Label>Apakah ada anggota keluarga yang menderita diabetes?</Label>
            <RadioGroup
              value={formData.familyHistory}
              onValueChange={(value) => setFormData({ ...formData, familyHistory: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="family-yes" />
                <Label htmlFor="family-yes" className="cursor-pointer">Ya</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="family-no" />
                <Label htmlFor="family-no" className="cursor-pointer">Tidak</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="family-unknown" />
                <Label htmlFor="family-unknown" className="cursor-pointer">Tidak tahu</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'physicalActivity':
        return (
          <div className="space-y-2">
            <Label>Seberapa sering Anda berolahraga?</Label>
            <RadioGroup
              value={formData.physicalActivity}
              onValueChange={(value) => setFormData({ ...formData, physicalActivity: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="regular" id="activity-regular" />
                <Label htmlFor="activity-regular" className="cursor-pointer">Rutin (3x atau lebih per minggu)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sometimes" id="activity-sometimes" />
                <Label htmlFor="activity-sometimes" className="cursor-pointer">Kadang-kadang (1-2x per minggu)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="activity-rarely" />
                <Label htmlFor="activity-rarely" className="cursor-pointer">Jarang (kurang dari 1x per minggu)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="never" id="activity-never" />
                <Label htmlFor="activity-never" className="cursor-pointer">Tidak pernah</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'diet':
        return (
          <div className="space-y-2">
            <Label>Bagaimana pola makan Anda?</Label>
            <RadioGroup
              value={formData.diet}
              onValueChange={(value) => setFormData({ ...formData, diet: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="healthy" id="diet-healthy" />
                <Label htmlFor="diet-healthy" className="cursor-pointer">Sehat (banyak sayur, buah, sedikit gula)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="diet-moderate" />
                <Label htmlFor="diet-moderate" className="cursor-pointer">Cukup sehat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="diet-poor" />
                <Label htmlFor="diet-poor" className="cursor-pointer">Kurang sehat (sering makan fast food)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_poor" id="diet-very-poor" />
                <Label htmlFor="diet-very-poor" className="cursor-pointer">Tidak sehat (tinggi gula dan lemak)</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'smoking':
        return (
          <div className="space-y-2">
            <Label>Apakah Anda merokok?</Label>
            <RadioGroup
              value={formData.smoking}
              onValueChange={(value) => setFormData({ ...formData, smoking: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="smoking-yes" />
                <Label htmlFor="smoking-yes" className="cursor-pointer">Ya</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="former" id="smoking-former" />
                <Label htmlFor="smoking-former" className="cursor-pointer">Dulu pernah, tapi sudah berhenti</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="smoking-no" />
                <Label htmlFor="smoking-no" className="cursor-pointer">Tidak pernah</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'bloodPressure':
        return (
          <div className="space-y-2">
            <Label>Bagaimana kondisi tekanan darah Anda?</Label>
            <RadioGroup
              value={formData.bloodPressure}
              onValueChange={(value) => setFormData({ ...formData, bloodPressure: value })}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="bp-normal" />
                <Label htmlFor="bp-normal" className="cursor-pointer">Normal (kurang dari 120/80 mmHg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="elevated" id="bp-elevated" />
                <Label htmlFor="bp-elevated" className="cursor-pointer">Sedikit tinggi (120-129 / kurang dari 80 mmHg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="bp-high" />
                <Label htmlFor="bp-high" className="cursor-pointer">Tinggi (130-139 / 80-89 mmHg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_high" id="bp-very-high" />
                <Label htmlFor="bp-very-high" className="cursor-pointer">Sangat tinggi (140/90 mmHg atau lebih)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="bp-unknown" />
                <Label htmlFor="bp-unknown" className="cursor-pointer">Tidak tahu</Label>
              </div>
            </RadioGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'fastingGlucose':
        return (
          <div className="space-y-2">
            <Label htmlFor="fastingGlucose">Gula Darah Puasa (mg/dL)</Label>
            <Input
              id="fastingGlucose"
              type="number"
              placeholder="Masukkan nilai jika ada"
              value={formData.fastingGlucose}
              onChange={(e) => setFormData({ ...formData, fastingGlucose: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Normal: kurang dari 100 mg/dL</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'hba1c':
        return (
          <div className="space-y-2">
            <Label htmlFor="hba1c">HbA1c (%)</Label>
            <Input
              id="hba1c"
              type="number"
              step="0.1"
              placeholder="Masukkan nilai jika ada"
              value={formData.hba1c}
              onChange={(e) => setFormData({ ...formData, hba1c: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Normal: kurang dari 5.7%</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'cholesterol':
        return (
          <div className="space-y-2">
            <Label htmlFor="cholesterol">Kolesterol Total (mg/dL)</Label>
            <Input
              id="cholesterol"
              type="number"
              placeholder="Masukkan nilai jika ada"
              value={formData.cholesterol}
              onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Normal: kurang dari 200 mg/dL</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )
      case 'waistCircumference':
        return (
          <div className="space-y-2">
            <Label htmlFor="waistCircumference">Lingkar Pinggang (cm)</Label>
            <Input
              id="waistCircumference"
              type="number"
              placeholder="Masukkan nilai jika ada"
              value={formData.waistCircumference}
              onChange={(e) => setFormData({ ...formData, waistCircumference: e.target.value })}
              className={error ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Risiko meningkat: Pria {'>'}90 cm, Wanita {'>'}80 cm</p>
            {error && <p className="text-sm text-destructive">{error}</p>}
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
                  Penilaian risiko berdasarkan data dasar dan gaya hidup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Data usia, berat, tinggi badan
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Riwayat keluarga
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Pola makan dan aktivitas fisik
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Waktu: sekitar 3 menit
                  </li>
                </ul>
                <Button 
                className="w-full mt-6 font-mono"
                onClick={(e) => {
                  e.stopPropagation()
                  setScreeningType('basic')
                }}
              >
                Pilih Skrining Dasar
              </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:border-primary hover:shadow-lg"
              onClick={() => setScreeningType('comprehensive')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <ClipboardCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-serif text-xl">Skrining Komprehensif</CardTitle>
                <CardDescription>
                  Penilaian lengkap dengan data laboratorium
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Semua data skrining dasar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Gula darah puasa dan HbA1c
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Kolesterol dan lingkar pinggang
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Waktu: sekitar 5 menit
                  </li>
                </ul>
                <Button 
                className="w-full mt-6 font-mono"
                onClick={(e) => {
                  e.stopPropagation()
                  setScreeningType('comprehensive')
                }}
              >
                Pilih Skrining Komprehensif
              </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Form screen
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Progress indicator */}
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
              <CardTitle className="font-serif text-xl">
                {steps[currentStep]?.title}
              </CardTitle>
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
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="font-mono"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                  </Button>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <Button 
                    onClick={handleNext}
                    className="ml-auto font-mono"
                  >
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

          <Button 
            variant="ghost" 
            className="mt-4 font-mono"
            onClick={() => {
              setScreeningType(null)
              setCurrentStep(0)
              setFormData({
                age: user?.age?.toString() || '',
                gender: user?.gender || '',
                weight: user?.weight?.toString() || '',
                height: user?.height?.toString() || '',
                familyHistory: '',
                physicalActivity: '',
                diet: '',
                smoking: '',
                bloodPressure: '',
                fastingGlucose: '',
                hba1c: '',
                cholesterol: '',
                waistCircumference: '',
              })
              setErrors({})
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
