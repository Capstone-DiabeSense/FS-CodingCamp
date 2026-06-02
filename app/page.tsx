'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/main-layout'
import { HeroBackground } from '@/components/hero-background'
import { useAuth } from '@/lib/auth-context'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  Shield,
  Clock,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Smartphone,
  FileText,
  Bell,
  ExternalLink
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

// Data from DiabeSense Analytics Dashboard
const ageDistribution = [
  { age: '18-30', count: 9.2 },
  { age: '31-40', count: 19.4 },
  { age: '41-50', count: 34.2 },
  { age: '51-60', count: 47.5 },
  { age: '61-70', count: 58.6 },
  { age: '71+',   count: 62.3 },
]

const riskDistribution = [
  { name: 'Non-Diabetes', value: 50, color: 'oklch(0.6 0.18 145)' },
  { name: 'Diabetes',     value: 50, color: 'oklch(0.55 0.2 25)' },
]

const comorbiditiesData = [
  { factor: 'Hipertensi',        value: 75.3 },
  { factor: 'Kolesterol Tinggi', value: 67.0 },
  { factor: 'Aktif Fisik',       value: 63.1 },
  { factor: 'Perokok',           value: 51.8 },
  { factor: 'Penyakit Jantung',  value: 22.3 },
  { factor: 'Stroke',            value: 9.2  },
]

function DashboardContent() {
  const { isLoggedIn, isLoading } = useAuth()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!isLoading) setMounted(true)
  }, [isLoading])

  if (!mounted) return null

  const features = [
    {
      icon: Shield,
      title: 'Skrining Akurat',
      description: 'Algoritma berbasis penelitian medis untuk hasil yang dapat diandalkan.',
    },
    {
      icon: Clock,
      title: 'Cepat & Mudah',
      description: 'Proses skrining hanya membutuhkan waktu kurang dari 5 menit.',
    },
    {
      icon: Smartphone,
      title: 'Responsif',
      description: 'Akses kapan saja dari perangkat apapun, mobile maupun desktop.',
    },
    {
      icon: FileText,
      title: 'Rekomendasi Personal',
      description: 'Dapatkan saran pencegahan yang disesuaikan dengan kondisi Anda.',
    },
    {
      icon: BarChart3,
      title: 'Lacak Riwayat',
      description: 'Pantau perkembangan risiko diabetes Anda dari waktu ke waktu.',
    },
    {
      icon: Bell,
      title: 'Reminder Otomatis',
      description: 'Atur pengingat untuk skrining ulang secara berkala.',
    },
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/20 py-20 md:py-32">
        <HeroBackground />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Activity className="h-4 w-4" />
              <span className="font-mono">{t('hero_badge')}</span>
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              {t('hero_title_1')}{' '}
              <span className="text-primary">DiabeSense</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed md:text-xl">
              {t('hero_subtitle')}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/screening">
                <Button size="lg" className="font-mono gap-2 w-full sm:w-auto">
                  {t('hero_btn_1')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a
                href="https://diabesense-dashboard.streamlit.app/#insight-komorbiditas-klinis"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="font-mono gap-2 w-full sm:w-auto">
                  {t('hero_btn_2')}
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Tentang DiabeSense
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              DiabeSense adalah aplikasi web inovatif yang membantu masyarakat Indonesia
              mengenali potensi risiko diabetes sejak dini. Dengan menggunakan kuesioner
              berbasis bukti ilmiah, aplikasi ini memberikan penilaian risiko yang akurat
              serta rekomendasi pencegahan yang personal.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Statistik Diabetes di Indonesia
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Data menunjukkan pentingnya deteksi dini untuk mencegah komplikasi diabetes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Komorbiditas Bar Chart — lg:col-span-2 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-serif">Faktor Komorbiditas pada Penderita Diabetes</CardTitle>
                <CardDescription>Persentase faktor risiko yang ditemukan pada penderita diabetes (%)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comorbiditiesData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
                        <XAxis type="number" domain={[0, 100]} stroke="oklch(0.5 0.02 200)" fontSize={12} unit="%" />
                        <YAxis type="category" dataKey="factor" stroke="oklch(0.5 0.02 200)" fontSize={11} width={120} />
                        <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(1 0 0)',
                          border: '1px solid oklch(0.9 0.02 200)',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-mono)'
                        }}
                        formatter={(value) => [`${value}%`, 'Persentase']}
                        />
                        <Bar dataKey="value" fill="oklch(0.55 0.15 180)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                        </div>
                        </CardContent>
                        </Card>
                        
                        {/* Risk Distribution Pie Chart */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="font-serif">Distribusi Dataset</CardTitle>
                            <CardDescription>Komposisi data skrining (n=70.692)</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    >
                                      {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                        </Pie>
                                        <Tooltip
                                        contentStyle={{
                                          backgroundColor: 'oklch(1 0 0)',
                                          border: '1px solid oklch(0.9 0.02 200)',
                                          borderRadius: '8px',
                                          fontFamily: 'var(--font-mono)'
                                        }}
                                        formatter={(value) => [`${value}%`, '']}
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-4 mt-4">
                                  {riskDistribution.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                      <span className="text-xs text-muted-foreground font-mono">{item.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                            
                            {/* Age Distribution Bar Chart */}
                            <Card className="lg:col-span-3">
                              <CardHeader>
                                <CardTitle className="font-serif">Risiko Diabetes per Kelompok Usia (%)</CardTitle>
                                <CardDescription>Persentase risiko diabetes berdasarkan kelompok usia (n=70.692)</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageDistribution}>
                                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
                                      <XAxis dataKey="age" stroke="oklch(0.5 0.02 200)" fontSize={12} />
                                      <YAxis stroke="oklch(0.5 0.02 200)" fontSize={12} unit="%" domain={[0, 100]} />
                                      <Tooltip
                                        contentStyle={{
                                          backgroundColor: 'oklch(1 0 0)',
                                          border: '1px solid oklch(0.9 0.02 200)',
                                          borderRadius: '8px',
                                          fontFamily: 'var(--font-mono)'
                                        }}
                                        formatter={(value) => [`${value}%`, 'Risiko Diabetes']}
                                      />
                                      <Bar dataKey="count" fill="oklch(0.55 0.15 180)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </CardContent>
                            </Card>
          </div>
        </div>
      </section>

      {/* Login Banner (only show if not logged in) */}
      {!isLoggedIn && (
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-2xl font-bold text-primary-foreground md:text-3xl">
                Dapatkan Akses Penuh ke Fitur DiabeSense
              </h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Login untuk menyimpan riwayat skrining, memantau perkembangan risiko,
                dan mengatur reminder skrining berkala.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-mono gap-2 w-full sm:w-auto"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Login Sekarang
                  </Button>
                </Link>
                <Link href="/login?tab=register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-mono bg-primary-foreground/10 text-primary-foreground hover:border-primary-foreground/30 w-full sm:w-auto"
                  >
                    Daftar Gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
