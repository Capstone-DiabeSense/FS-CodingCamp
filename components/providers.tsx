'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { ScreeningProvider } from '@/lib/screening-context'
import { ThemeProvider } from '@/components/theme-provider'
import '@/lib/i18n'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <ScreeningProvider>
          {children}
        </ScreeningProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
