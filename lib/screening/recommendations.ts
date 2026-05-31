import { Apple, Dumbbell, Heart, Moon, Stethoscope, type LucideIcon } from 'lucide-react'

export interface Recommendation {
  icon: LucideIcon
  title: string
  description: string
}

export const PREVENTION_RECOMMENDATIONS: Recommendation[] = [
  {
    icon: Apple,
    title: 'Pola Makan Sehat',
    description:
      'Perbanyak sayur, buah, dan biji-bijian. Kurangi gula, garam, dan makanan olahan.',
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
    description:
      'Lakukan pemeriksaan gula darah secara berkala, terutama jika berusia di atas 45 tahun.',
  },
]
