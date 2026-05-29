import type { Metadata } from 'next'
import { Poppins, Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'DiabeSense - Aplikasi Skrining Risiko Diabetes',
  description: 'Kenali risiko diabetes Anda lebih awal dengan DiabeSense. Aplikasi skrining diabetes yang mudah, cepat, dan akurat.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${plusJakartaSans.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
