import { Suspense } from 'react'
import LoginContent from './login-content'

export const dynamic = 'force-dynamic'

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground font-mono text-sm">Memuat...</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  )
}
