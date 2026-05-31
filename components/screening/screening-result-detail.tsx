'use client'

import type { ScreeningResult } from '@/lib/screening-context'
import { DEFAULT_DISCLAIMER } from '@/lib/screening/constants'
import { PREVENTION_RECOMMENDATIONS } from '@/lib/screening/recommendations'
import { getRiskStyle, type RiskLevel } from '@/lib/screening/risk-styles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Sparkles } from 'lucide-react'

interface ScreeningResultDetailProps {
  result: ScreeningResult
  showRecommendations?: boolean
  showDisclaimer?: boolean
  showMood?: boolean
}

export function ScreeningResultDetail({
  result,
  showRecommendations = true,
  showDisclaimer = true,
  showMood = true,
}: ScreeningResultDetailProps) {
  const riskConfig = getRiskStyle(result.riskLevel as RiskLevel)
  const RiskIcon = riskConfig.icon
  const disclaimerText = result.disclaimer || DEFAULT_DISCLAIMER
  const probabilityPercent = Math.round(
    (result.probability ?? result.score / 100) * 100,
  )

  return (
    <div className="space-y-6">
      <Card className={riskConfig.card}>
        <CardHeader className="text-center pb-4">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${riskConfig.iconWrap}`}
          >
            <RiskIcon className={`h-10 w-10 ${riskConfig.score}`} />
          </div>
          <CardTitle className={`font-serif text-3xl ${riskConfig.title}`}>
            {riskConfig.label}
          </CardTitle>
          <CardDescription className="text-foreground text-lg mt-2">
            {riskConfig.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-sm text-muted-foreground font-mono">
              Probabilitas Risiko
            </span>
            <span className={`text-5xl font-bold ${riskConfig.score}`}>
              {probabilityPercent}%
            </span>
            <span className="text-sm text-muted-foreground font-mono">
              Kategori: {result.riskCategory ?? riskConfig.label.replace('Risiko ', '')}
            </span>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Jenis:{' '}
              {result.type === 'comprehensive'
                ? 'Skrining Komprehensif'
                : 'Skrining Dasar'}
            </p>
            <p>
              Tanggal:{' '}
              {new Date(result.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Penjelasan Hasil
          </CardTitle>
          <CardDescription>
            Ringkasan hasil skrining berdasarkan data Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {result.explanation ??
              'Penjelasan tidak tersedia untuk hasil skrining ini.'}
          </p>
        </CardContent>
      </Card>

      {showRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Rekomendasi Pencegahan</CardTitle>
            <CardDescription>
              Langkah-langkah yang dapat Anda lakukan untuk menjaga kesehatan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {PREVENTION_RECOMMENDATIONS.map((rec, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <rec.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showMood && result.mood && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Catatan Perasaan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {result.mood}
            </p>
          </CardContent>
        </Card>
      )}

      {showDisclaimer && (
        <Card className="bg-muted/30">
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
      )}
    </div>
  )
}
