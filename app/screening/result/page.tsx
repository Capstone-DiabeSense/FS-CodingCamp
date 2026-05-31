'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useScreening } from '@/lib/screening-context'
import { ScreeningResultDetail } from '@/components/screening/screening-result-detail'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import {
  AlertCircle,
  CheckCircle,
  Printer,
  ArrowLeft,
  LogIn,
  Save,
} from 'lucide-react'

function ScreeningResultContent() {
  const { isLoggedIn, isLoading } = useAuth()
  const { currentResult, updateResultMood } = useScreening()
  const [mood, setMood] = useState(currentResult?.mood || '')
  const [moodSaved, setMoodSaved] = useState(false)

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

  const handlePrint = () => {
    window.print()
  }

  const handleSaveMood = () => {
    updateResultMood(currentResult.id, mood)
    setMoodSaved(true)
    setTimeout(() => setMoodSaved(false), 3000)
  }

  const showLoginPrompt = !isLoading && !isLoggedIn

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24 print:py-8">
        <div className="mx-auto max-w-3xl" id="screening-result-print">
          <div className="screening-result-content">
            <ScreeningResultDetail
              result={currentResult}
              showMood={false}
            />
          </div>

          <Card className="mb-8 print:hidden">
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
                {!isLoading &&
                  (isLoggedIn ? (
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
                        <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Tersimpan
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <Link href="/login" className="text-primary hover:underline">
                        Login
                      </Link>{' '}
                      untuk menyimpan catatan ini ke riwayat Anda.
                    </p>
                  ))}
              </div>
            </CardContent>
          </Card>

          {showLoginPrompt && (
            <Card className="mb-8 border-primary/50 bg-primary/5 print:hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      Simpan Hasil Skrining Anda
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Login untuk menyimpan hasil ini ke riwayat dan memantau perkembangan
                      risiko Anda.
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

          <div className="flex flex-col sm:flex-row gap-4 print:hidden">
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
              <Button className="w-full font-mono">Ke Dashboard</Button>
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
