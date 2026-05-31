import type { LucideIcon } from 'lucide-react'
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface RiskStyleConfig {
  icon: LucideIcon
  label: string
  description: string
  card: string
  iconWrap: string
  title: string
  score: string
  badge: string
}

const RISK_STYLES: Record<RiskLevel, RiskStyleConfig> = {
  low: {
    icon: CheckCircle,
    label: 'Risiko Rendah',
    description: 'Hasil skrining menunjukkan risiko diabetes Anda tergolong rendah.',
    card: 'border-2 border-green-500/30 bg-green-500/10 dark:bg-green-500/15',
    iconWrap: 'bg-green-500/15 dark:bg-green-500/20',
    title: 'text-green-700 dark:text-green-400',
    score: 'text-green-700 dark:text-green-400',
    badge: 'text-green-700 bg-green-500/15 dark:text-green-400 dark:bg-green-500/20',
  },
  medium: {
    icon: AlertCircle,
    label: 'Risiko Sedang',
    description:
      'Hasil skrining menunjukkan risiko diabetes Anda tergolong sedang. Perhatikan gaya hidup Anda.',
    card: 'border-2 border-yellow-500/30 bg-yellow-500/10 dark:bg-yellow-500/15',
    iconWrap: 'bg-yellow-500/15 dark:bg-yellow-500/20',
    title: 'text-yellow-700 dark:text-yellow-400',
    score: 'text-yellow-700 dark:text-yellow-400',
    badge: 'text-yellow-700 bg-yellow-500/15 dark:text-yellow-400 dark:bg-yellow-500/20',
  },
  high: {
    icon: AlertTriangle,
    label: 'Risiko Tinggi',
    description:
      'Hasil skrining menunjukkan risiko diabetes Anda tergolong tinggi. Segera konsultasikan dengan dokter.',
    card: 'border-2 border-red-500/30 bg-red-500/10 dark:bg-red-500/15',
    iconWrap: 'bg-red-500/15 dark:bg-red-500/20',
    title: 'text-red-700 dark:text-red-400',
    score: 'text-red-700 dark:text-red-400',
    badge: 'text-red-700 bg-red-500/15 dark:text-red-400 dark:bg-red-500/20',
  },
}

export function getRiskStyle(level: RiskLevel): RiskStyleConfig {
  return RISK_STYLES[level]
}

export function getRiskLabel(level: RiskLevel | string): string {
  switch (level) {
    case 'low':
      return 'Rendah'
    case 'medium':
      return 'Sedang'
    case 'high':
      return 'Tinggi'
    default:
      return level
  }
}
