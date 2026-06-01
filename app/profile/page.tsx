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
  User, Mail, Phone, Calendar, Ruler, Weight,
  Save, Pencil, X, History, Bell, ArrowRight, CheckCircle, Venus
} from 'lucide-react'

function ProfileContent() {
  const router = useRouter()
  const { user, isLoggedIn, isLoading, updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', age: '', height: '', weight: '', gender: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isLoading) return
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, isLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        age: user.age?.toString() || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        gender: user.gender || '',
      })
    }
  }, [user])

  if (isLoading || !isLoggedIn || !user) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi'
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
      gender: formData.gender || undefined,
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
      gender: user.gender || '',
    })
    setIsEditing(false)
    setErrors({})
  }

  const calculateBMI = () => {
    if (user.weight && user.height) {
      const heightM = user.height / 100
      return (user.weight / (heightM * heightM)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Kurus', color: 'text-yellow-600' }
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-600' }
    return { label: 'Obesitas', color: 'text-red-600' }
  }

  const getGenderLabel = (value: string) => {
    if (value === 'male') return 'Laki-laki'
    if (value === 'female') return 'Perempuan'
    return '-'
  }

  const bmi = calculateBMI()
  const bmiCategory = bmi ? getBMICategory(Number(bmi)) : null

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Profile Saya</h1>
            <p className="mt-2 text-muted-foreground">Kelola informasi akun dan data kesehatan Anda</p>
          </div>

          {isSaved && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Perubahan berhasil disimpan</span>
            </div>
          )}

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-serif text-xl flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Informasi Profil
                  </CardTitle>
                  <CardDescription>Data identitas dan kesehatan Anda</CardDescription>
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
                  {[
                    { id: 'name', label: 'Nama Lengkap', icon: User, type: 'text' },
                    { id: 'email', label: 'Email', icon: Mail, type: 'email' },
                    { id: 'phone', label: 'Nomor Telepon', icon: Phone, type: 'tel' },
                    { id: 'age', label: 'Usia (tahun)', icon: Calendar, type: 'number', placeholder: 'Masukkan usia' },
                    { id: 'height', label: 'Tinggi Badan (cm)', icon: Ruler, type: 'number', placeholder: 'Masukkan tinggi badan' },
                    { id: 'weight', label: 'Berat Badan (kg)', icon: Weight, type: 'number', placeholder: 'Masukkan berat badan' },
                  ].map(({ id, label, icon: Icon, type, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {label}
                      </Label>
                      <Input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        value={formData[id as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                        className={errors[id] ? 'border-destructive' : ''}
                      />
                      {errors[id] && <p className="text-sm text-destructive">{errors[id]}</p>}
                    </div>
                  ))}

                  {/* Gender field */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <Venus className="h-4 w-4 text-muted-foreground" />
                      Jenis Kelamin
                    </Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="font-mono">
                      <Save className="mr-2 h-4 w-4" />Simpan
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="font-mono">
                      <X className="mr-2 h-4 w-4" />Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      { icon: User, label: 'Nama Lengkap', value: user.name },
                      { icon: Mail, label: 'Email', value: user.email },
                      { icon: Phone, label: 'Nomor Telepon', value: user.phone },
                      { icon: Venus, label: 'Jenis Kelamin', value: getGenderLabel(user.gender || '') },
                      { icon: Calendar, label: 'Usia', value: user.age ? `${user.age} tahun` : '-' },
                      { icon: Ruler, label: 'Tinggi Badan', value: user.height ? `${user.height} cm` : '-' },
                      { icon: Weight, label: 'Berat Badan', value: user.weight ? `${user.weight} kg` : '-' },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{label}</p>
                          <p className="font-medium text-foreground">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

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

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { href: '/history', icon: History, title: 'Riwayat Skrining', desc: 'Lihat hasil skrining sebelumnya' },
              { href: '/reminder', icon: Bell, title: 'Reminder', desc: 'Kelola pengingat untuk jadwal ulang skrining' },
            ].map(({ href, icon: Icon, title, desc }) => (
              <Link key={href} href={href}>
                <Card className="cursor-pointer hover:border-primary hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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