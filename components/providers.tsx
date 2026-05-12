'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { ScreeningProvider } from '@/lib/screening-context'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ScreeningProvider>
        {children}
      </ScreeningProvider>
    </AuthProvider>
  )
}
