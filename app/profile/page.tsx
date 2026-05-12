'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Ruler,
  Weight,
  Save,
  Pencil,
  X,
  History,
  Bell,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

function ProfileContent() {
  const router = useRouter()
  const { user, isLoggedIn, updateUser } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age?.toString() || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
      })
    }
  }, [user])

  if (!isLoggedIn || !user) {
    return null
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi'
    }

    if (formData.age && (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120)) {
      newErrors.age = 'Usia harus antara 1-120 tahun'
    }

    if (formData.height && (isNaN(Number(formData.height)) || Number(formData.height) < 50 || Number(formData.height) > 250)) {
      newErrors.height = 'Tinggi badan harus antara 50-250 cm'
    }

    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 20 || Number(formData.weight) > 300)) {
      newErrors.weight = 'Berat badan harus antara 20-300 kg'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    updateUser({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: formData.age ? Number(formData.age) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
    })

    setIsEditing(false)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      age: user.age?.toString() || '',
      height: user.height?.toString() || '',
      weight: user.weight?.toString() || '',
    })
    setIsEditing(false)
    setErrors({})
  }

  const calculateBMI = () => {
    if (user.weight && user.height) {
      const heightM = user.height / 100
      const bmi = user.weight / (heightM * heightM)
      return bmi.toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Kurus', color: 'text-yellow-600' }
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' }
    return { label: 'Obesitas', color: 'text-red-600' }
  }

  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Profile Saya
            </h1>
            <p className="mt-2 text-muted-foreground">
              Kelola informasi akun dan data kesehatan Anda
            </p>
          </div>

          {/* Saved Notification */}
          {isSaved && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Perubahan berhasil disimpan</span>
            </div>
          )}

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informasi Profil
                  </CardTitle>
                  <CardDescription>
                    Data identitas dan kesehatan Anda
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(true)} className="font-mono">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Nama Lengkap
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Nomor Telepon
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Usia (tahun)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Masukkan usia"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={errors.age ? 'border-destructive' : ''}
                    />
                    {errors.age && <p className="text-sm text-destructive">{errors.age}</p>}
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      Tinggi Badan (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Masukkan tinggi badan"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className={errors.height ? 'border-destructive' : ''}
                    />
                    {errors.height && <p className="text-sm text-destructive">{errors.height}</p>}
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      Berat Badan (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Masukkan berat badan"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className={errors.weight ? 'border-destructive' : ''}
                    />
                    {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="font-mono">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="font-mono">
                      <X className="mr-2 h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Display Data */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                        <p className="font-medium text-foreground">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor Telepon</p>
                        <p className="font-medium text-foreground">{user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Usia</p>
                        <p className="font-medium text-foreground">
                          {user.age ? `${user.age} tahun` : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Ruler className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tinggi Badan</p>
                        <p className="font-medium text-foreground">
                          {user.height ? `${user.height} cm` : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Weight className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Berat Badan</p>
                        <p className="font-medium text-foreground">
                          {user.weight ? `${user.weight} kg` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BMI Card */}
                  {bmi && bmiCategory && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Indeks Massa Tubuh (BMI)</p>
                          <p className="text-2xl font-bold text-foreground">{bmi}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${bmiCategory.color} bg-background`}>
                          {bmiCategory.label}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/history">
              <Card className="cursor-pointer hover:border-primary hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <History className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Riwayat Skrining</h3>
                      <p className="text-sm text-muted-foreground">Lihat hasil skrining sebelumnya</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reminder">
              <Card className="cursor-pointer hover:border-primary hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">Reminder</h3>
                      <p className="text-sm text-muted-foreground">Kelola pengingat skrining</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProfilePage() {
  return (
    <Providers>
      <ProfileContent />
    </Providers>
  )
}
