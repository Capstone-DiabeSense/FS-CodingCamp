'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { loginWithEmail, registerWithEmail, sendResetPasswordEmail } from '@/lib/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'

type ActiveTab = 'login' | 'register'

function AlertError({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
      {message}
    </div>
  )
}

function AlertSuccess({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
      {message}
    </div>
  )
}

function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  id: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  showPassword: boolean
  onToggle: () => void
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={onToggle}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

function LoginForm({
  onForgotPassword,
}: {
  onForgotPassword: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Mohon lengkapi semua field')
      return
    }

    setError('')
    setIsLoading(true)
    const { error } = await loginWithEmail(form.email, form.password)
    if (!error) {
      router.push('/')
    } else {
      setError(error)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AlertError message={error} />

      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <PasswordInput
          id="login-password"
          placeholder="Masukkan password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-primary hover:underline"
          onClick={onForgotPassword}
        >
          Lupa Password?
        </button>
      </div>

      <Button type="submit" className="w-full font-mono" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : 'Login'}
      </Button>
    </form>
  )
}

function RegisterForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Mohon lengkapi semua field')
      return
    }

    setError('')
    setIsLoading(true)
    const { error } = await registerWithEmail(form)
    if (!error) {
      onSuccess(form.email)
    } else {
      setError(error)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AlertError message={error} />

      <div className="space-y-2">
        <Label htmlFor="register-name">Nama Lengkap</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Masukkan nama lengkap"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone">Nomor Telepon</Label>
        <Input
          id="register-phone"
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <PasswordInput
          id="register-password"
          placeholder="Minimal 6 karakter"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />
      </div>

      <Button type="submit" className="w-full font-mono" disabled={isLoading}>
        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : 'Daftar'}
      </Button>
    </form>
  )
}

function ForgotPasswordForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void
  onSuccess: (email: string) => void
}) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const { error } = await sendResetPasswordEmail(email)
    if (!error) {
      onSuccess(email)
    } else {
      setError(error)
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="font-serif text-2xl">Lupa Password</CardTitle>
        <CardDescription>Masukkan email Anda untuk menerima link reset password</CardDescription>
      </CardHeader>
      <CardContent>
        <AlertError message={error} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgot-email">Email</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full font-mono" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</> : 'Kirim Link Reset'}
          </Button>

          <Button type="button" variant="ghost" className="w-full font-mono" onClick={onBack}>
            Kembali ke Login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn } = useAuth()

  const [activeTab, setActiveTab] = useState<ActiveTab>('login')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (searchParams.get('tab') === 'register') setActiveTab('register')
  }, [searchParams])

  useEffect(() => {
    if (isLoggedIn) router.push('/')
  }, [isLoggedIn, router])

  const switchTab = (tab: ActiveTab) => {
    setActiveTab(tab)
    setSuccessMessage('')
  }

  if (showForgotPassword) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-md">
            <ForgotPasswordForm
              onBack={() => {
                setShowForgotPassword(false)
                setSuccessMessage('')
              }}
              onSuccess={(email) => {
                setShowForgotPassword(false)
                setSuccessMessage(`Link reset password telah dikirim ke ${email}`)
              }}
            />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">
                {activeTab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'login'
                  ? 'Masuk ke akun DiabeSense Anda'
                  : 'Daftar untuk mengakses semua fitur'}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Tab Switcher */}
              <div className="mb-6 flex rounded-lg bg-muted p-1">
                {(['login', 'register'] as ActiveTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`flex-1 rounded-md py-2 font-mono text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => switchTab(tab)}
                  >
                    {tab === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              <AlertSuccess message={successMessage} />

              {activeTab === 'login' ? (
                <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
              ) : (
                <RegisterForm
                  onSuccess={(email) => {
                    setSuccessMessage('Registrasi berhasil! Cek email kamu untuk verifikasi akun sebelum login.')
                    switchTab('login')
                  }}
                />
              )}

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {activeTab === 'login' ? (
                  <>
                    Belum punya akun?{' '}
                    <button type="button" className="text-primary hover:underline" onClick={() => switchTab('register')}>
                      Daftar sekarang
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{' '}
                    <button type="button" className="text-primary hover:underline" onClick={() => switchTab('login')}>
                      Login
                    </button>
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="#" className="text-primary hover:underline">Syarat & Ketentuan</Link>
            {' '}dan{' '}
            <Link href="#" className="text-primary hover:underline">Kebijakan Privasi</Link>
            {' '}kami.
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default function LoginPage() {
  return (
    <Providers>
      <LoginContent />
    </Providers>
  )
}