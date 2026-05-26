'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useScreening } from '@/lib/screening-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { 
  History, 
  ClipboardList, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function HistoryContent() {
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuth()
  const { results } = useScreening()

  useEffect(() => {
    if (isLoading) return
    if (!isLoggedIn) router.push('/login')
  }, [isLoggedIn, isLoading, router])

  if (isLoading || !isLoggedIn) return null

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return null
    }
  }

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'Rendah'
      case 'medium': return 'Sedang'
      case 'high': return 'Tinggi'
      default: return level
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return ''
    }
  }

  const chartData = results
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((result) => ({
      date: new Date(result.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      score: result.score,
      fullDate: new Date(result.date).toLocaleDateString('id-ID', { 
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
      }),
    }))

  const sortedResults = [...results].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (results.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground mb-4">
              Belum Ada Riwayat Skrining
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Anda belum pernah melakukan skrining. Mulai skrining pertama Anda untuk 
              mengetahui risiko diabetes dan memantau perkembangannya.
            </p>
            <Link href="/screening">
              <Button className="font-mono">
                Mulai Skrining Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Riwayat Skrining
            </h1>
            <p className="mt-2 text-muted-foreground">
              Pantau perkembangan risiko diabetes Anda dari waktu ke waktu
            </p>
          </div>

          {chartData.length > 1 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-xl flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Tren Risiko
                </CardTitle>
                <CardDescription>Perubahan skor risiko diabetes Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.02 200)" />
                      <XAxis dataKey="date" stroke="oklch(0.5 0.02 200)" fontSize={12} tickMargin={10} />
                      <YAxis stroke="oklch(0.5 0.02 200)" fontSize={12} domain={[0, 100]} tickMargin={10} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: 'oklch(1 0 0)', 
                          border: '1px solid oklch(0.9 0.02 200)',
                          borderRadius: '8px',
                          fontFamily: 'var(--font-mono)'
                        }}
                        labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
                        formatter={(value: number) => [`Skor: ${value}`, '']}
                      />
                      <Line 
                        type="monotone" dataKey="score" stroke="oklch(0.55 0.15 180)" strokeWidth={3}
                        dot={{ fill: 'oklch(0.55 0.15 180)', strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">0-29: Rendah</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">30-59: Sedang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">60+: Tinggi</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Daftar Hasil Skrining</CardTitle>
              <CardDescription>{results.length} hasil skrining tercatat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedResults.map((result) => (
                  <div 
                    key={result.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getRiskIcon(result.riskLevel)}
                      <div>
                        <div className="font-medium text-foreground">
                          {new Date(result.date).toLocaleDateString('id-ID', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.type === 'comprehensive' ? 'Skrining Komprehensif' : 'Skrining Dasar'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                        Risiko {getRiskLabel(result.riskLevel)}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">{result.score}</div>
                        <div className="text-xs text-muted-foreground font-mono">Skor</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/screening">
              <Button className="font-mono">
                Lakukan Skrining Baru
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function HistoryPage() {
  return (
    <Providers>
      <HistoryContent />
    </Providers>
  )
}