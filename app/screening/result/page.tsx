'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useScreening } from '@/lib/screening-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { DEFAULT_DISCLAIMER } from '@/lib/screening/constants'
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Printer,
  ArrowLeft,
  LogIn,
  Save,
  Heart,
  Apple,
  Dumbbell,
  Moon,
  Stethoscope,
} from 'lucide-react'

function ScreeningResultContent() {
  const { isLoggedIn, isLoading } = useAuth()
  const { currentResult, updateResultMood } = useScreening()
  const [mood, setMood] = useState(currentResult?.mood || '')
  const [moodSaved, setMoodSaved] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  if (!currentResult) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-md text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
              Tidak Ada Hasil Skrining
            </h1>
            <p className="text-muted-foreground mb-6">
              Anda belum melakukan skrining. Silakan lakukan skrining terlebih dahulu.
            </p>
            <Link href="/screening">
              <Button className="font-mono">Mulai Skrining</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getRiskConfig = () => {
    switch (currentResult.riskLevel) {
      case 'low':
        return {
          icon: CheckCircle,
          label: 'Risiko Rendah',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          description: 'Hasil skrining menunjukkan risiko diabetes Anda tergolong rendah.',
        }
      case 'medium':
        return {
          icon: AlertCircle,
          label: 'Risiko Sedang',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          description: 'Hasil skrining menunjukkan risiko diabetes Anda tergolong sedang. Perhatikan gaya hidup Anda.',
        }
      case 'high':
        return {
          icon: AlertTriangle,
          label: 'Risiko Tinggi',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          description: 'Hasil skrining menunjukkan risiko diabetes Anda tergolong tinggi. Segera konsultasikan dengan dokter.',
        }
    }
  }

  const riskConfig = getRiskConfig()
  const RiskIcon = riskConfig.icon
  const disclaimerText = currentResult.disclaimer || DEFAULT_DISCLAIMER
  const probabilityPercent = Math.round((currentResult.probability ?? currentResult.score / 100) * 100)

  const recommendations = [
    {
      icon: Apple,
      title: 'Pola Makan Sehat',
      description: 'Perbanyak sayur, buah, dan biji-bijian. Kurangi gula, garam, dan makanan olahan.',
    },
    {
      icon: Dumbbell,
      title: 'Aktivitas Fisik Rutin',
      description: 'Lakukan olahraga minimal 30 menit sehari, 5 kali seminggu.',
    },
    {
      icon: Heart,
      title: 'Jaga Berat Badan Ideal',
      description: 'Pertahankan BMI antara 18.5-24.9 untuk mengurangi risiko diabetes.',
    },
    {
      icon: Moon,
      title: 'Istirahat Cukup',
      description: 'Tidur 7-9 jam per malam dan kelola stres dengan baik.',
    },
    {
      icon: Stethoscope,
      title: 'Pemeriksaan Rutin',
      description: 'Lakukan pemeriksaan gula darah secara berkala, terutama jika berusia di atas 45 tahun.',
    },
  ]

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Hasil Skrining DiabeSense</title>
              <style>
                body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1, h2, h3 { margin-bottom: 0.5rem; }
                .risk-card { padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .low { background: #f0fdf4; border: 1px solid #bbf7d0; }
                .medium { background: #fefce8; border: 1px solid #fef08a; }
                .high { background: #fef2f2; border: 1px solid #fecaca; }
                .recommendation { margin-bottom: 16px; }
                .disclaimer { background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>
              <h1>DiabeSense - Hasil Skrining</h1>
              <p>Tanggal: ${new Date(currentResult.date).toLocaleDateString('id-ID', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}</p>
              <p>Jenis: ${currentResult.type === 'comprehensive' ? 'Skrining Komprehensif' : 'Skrining Dasar'}</p>
              <div class="risk-card ${currentResult.riskLevel}">
                <h2>${riskConfig.label}</h2>
                <p>Probabilitas Risiko: ${probabilityPercent}%</p>
                <p>${riskConfig.description}</p>
              </div>
              <h3>Rekomendasi Pencegahan</h3>
              ${recommendations.map(r => `
                <div class="recommendation">
                  <strong>${r.title}</strong>
                  <p>${r.description}</p>
                </div>
              `).join('')}
              <div class="disclaimer">
                <strong>Disclaimer:</strong> ${disclaimerText}
              </div>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleSaveMood = () => {
    updateResultMood(currentResult.id, mood)
    setMoodSaved(true)
    setTimeout(() => setMoodSaved(false), 3000)
  }

  // Tampilkan area mood & login prompt hanya setelah auth selesai load
  const showLoginPrompt = !isLoading && !isLoggedIn

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl" ref={printRef}>
          {/* Result Card */}
          <Card className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2 mb-8`}>
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${riskConfig.bgColor}`}>
                <RiskIcon className={`h-10 w-10 ${riskConfig.color}`} />
              </div>
              <CardTitle className={`font-serif text-3xl ${riskConfig.color}`}>
                {riskConfig.label}
              </CardTitle>
              <CardDescription className="text-foreground/80 text-lg mt-2">
                {riskConfig.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="inline-flex flex-col items-center">
                <span className="text-sm text-muted-foreground font-mono">Probabilitas Risiko</span>
                <span className={`text-5xl font-bold ${riskConfig.color}`}>{probabilityPercent}%</span>
                <span className="text-sm text-muted-foreground font-mono">
                  Kategori: {currentResult.riskCategory ?? riskConfig.label.replace('Risiko ', '')}
                </span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Jenis: {currentResult.type === 'comprehensive' ? 'Skrining Komprehensif' : 'Skrining Dasar'}</p>
                <p>Tanggal: {new Date(currentResult.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}</p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Rekomendasi Pencegahan</CardTitle>
              <CardDescription>
                Langkah-langkah yang dapat Anda lakukan untuk menjaga kesehatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <rec.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mood Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Bagaimana Perasaan Anda?</CardTitle>
              <CardDescription>
                Ceritakan perasaan Anda setelah mengetahui hasil skrining ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Tuliskan perasaan atau refleksi Anda di sini..."
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  rows={4}
                />
                {/* Tunggu isLoading selesai sebelum render tombol/prompt */}
                {!isLoading && (
                  isLoggedIn ? (
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={handleSaveMood}
                        className="font-mono"
                        disabled={!mood.trim()}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Simpan
                      </Button>
                      {moodSaved && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Tersimpan
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <Link href="/login" className="text-primary hover:underline">Login</Link>
                      {' '}untuk menyimpan catatan ini ke riwayat Anda.
                    </p>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-8 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <AlertCircle className="h-6 w-6 shrink-0 text-muted-foreground" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Disclaimer</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {disclaimerText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Prompt — hanya muncul setelah loading selesai dan user belum login */}
          {showLoginPrompt && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Simpan Hasil Skrining Anda</h4>
                    <p className="text-sm text-muted-foreground">
                      Login untuk menyimpan hasil ini ke riwayat dan memantau perkembangan risiko Anda.
                    </p>
                  </div>
                  <Link href="/login">
                    <Button className="font-mono">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handlePrint} variant="outline" className="font-mono">
              <Printer className="mr-2 h-4 w-4" />
              Print Hasil
            </Button>
            <Link href="/screening" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full font-mono">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <Link href="/" className="flex-1 sm:flex-none">
              <Button className="w-full font-mono">
                Ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ScreeningResultPage() {
  return (
    <Providers>
      <ScreeningResultContent />
    </Providers>
  )
}