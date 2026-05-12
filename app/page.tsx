'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { useAuth } from '@/lib/auth-context'
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
  LineChart,
  Line,
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

// Dummy data for statistics charts
const trendData = [
  { month: 'Jan', cases: 4200 },
  { month: 'Feb', cases: 4500 },
  { month: 'Mar', cases: 4300 },
  { month: 'Apr', cases: 4800 },
  { month: 'Mei', cases: 5100 },
  { month: 'Jun', cases: 5400 },
]

const ageDistribution = [
  { age: '18-30', count: 15 },
  { age: '31-40', count: 25 },
  { age: '41-50', count: 35 },
  { age: '51-60', count: 20 },
  { age: '60+', count: 5 },
]

const riskDistribution = [
  { name: 'Rendah', value: 45, color: 'oklch(0.6 0.18 145)' },
  { name: 'Sedang', value: 35, color: 'oklch(0.75 0.18 85)' },
  { name: 'Tinggi', value: 20, color: 'oklch(0.55 0.2 25)' },
]

function DashboardContent() {
  const { isLoggedIn } = useAuth()

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
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Activity className="h-4 w-4" />
              <span className="font-mono">Platform Skrining Diabetes Terpercaya</span>
            </div>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Kenali Risiko Diabetes Anda Lebih Awal dengan{' '}
              <span className="text-primary">DiabeSense</span>
            </h1>
            
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed md:text-xl">
              Deteksi dini adalah kunci pencegahan. Lakukan skrining risiko diabetes secara mandiri, 
              cepat, dan akurat dari mana saja.
            </p>
            
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/screening">
                <Button size="lg" className="font-mono gap-2 w-full sm:w-auto">
                  Coba Skrining Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a 
                href="https://example.com/dashboard-analitik" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="font-mono gap-2 w-full sm:w-auto">
                  Lihat Dashboard Analitik
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
            {/* Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="font-serif">Tren Kasus Diabetes (Ribu)</CardTitle>
                <CardDescription>Perkembangan jumlah kasus dalam 6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
                      <XAxis dataKey="month" stroke="oklch(0.5 0.02 200)" fontSize={12} />
                      <YAxis stroke="oklch(0.5 0.02 200)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(1 0 0)', 
                          border: '1px solid oklch(0.9 0.02 200)',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-mono)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cases" 
                        stroke="oklch(0.55 0.15 180)" 
                        strokeWidth={3}
                        dot={{ fill: 'oklch(0.55 0.15 180)', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Distribusi Risiko</CardTitle>
                <CardDescription>Berdasarkan hasil skrining</CardDescription>
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
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {riskDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground font-mono">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Age Distribution Bar Chart */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="font-serif">Distribusi Usia Penderita (%)</CardTitle>
                <CardDescription>Persentase penderita diabetes berdasarkan kelompok usia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
                      <XAxis dataKey="age" stroke="oklch(0.5 0.02 200)" fontSize={12} />
                      <YAxis stroke="oklch(0.5 0.02 200)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(1 0 0)', 
                          border: '1px solid oklch(0.9 0.02 200)',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-mono)'
                        }} 
                      />
                      <Bar 
                        dataKey="count" 
                        fill="oklch(0.55 0.15 180)" 
                        radius={[4, 4, 0, 0]}
                      />
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
                    className="font-mono border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 w-full sm:w-auto"
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
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  )
}
