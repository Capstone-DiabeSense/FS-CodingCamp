'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/main-layout'
import { Providers } from '@/components/providers'
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, isLoggedIn } = useAuth()
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '' 
  })
  const [forgotEmail, setForgotEmail] = useState('')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'register') {
      setActiveTab('register')
    }
  }, [searchParams])

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!loginForm.email || !loginForm.password) {
      setError('Mohon lengkapi semua field')
      setIsLoading(false)
      return
    }

    const success = await login(loginForm.email, loginForm.password)
    
    if (success) {
      router.push('/')
    } else {
      setError('Email atau password salah')
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password) {
      setError('Mohon lengkapi semua field')
      setIsLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('Password minimal 6 karakter')
      setIsLoading(false)
      return
    }

    const success = await register(
      registerForm.name, 
      registerForm.email, 
      registerForm.phone, 
      registerForm.password
    )
    
    if (success) {
      router.push('/')
    } else {
      setError('Email sudah terdaftar')
    }
    
    setIsLoading(false)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate forgot password
    alert(`Link reset password telah dikirim ke ${forgotEmail}`)
    setShowForgotPassword(false)
    setForgotEmail('')
  }

  if (showForgotPassword) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-serif text-2xl">Lupa Password</CardTitle>
                <CardDescription>
                  Masukkan email Anda untuk menerima link reset password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full font-mono">
                    Kirim Link Reset
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full font-mono"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Kembali ke Login
                  </Button>
                </form>
              </CardContent>
            </Card>
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
              {/* Tab Toggle */}
              <div className="mb-6 flex rounded-lg bg-muted p-1">
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 font-mono text-sm font-medium transition-colors ${
                    activeTab === 'login' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    setActiveTab('login')
                    setError('')
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-md py-2 font-mono text-sm font-medium transition-colors ${
                    activeTab === 'register' 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => {
                    setActiveTab('register')
                    setError('')
                  }}
                >
                  Register
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Lupa Password?
                    </button>
                  </div>
                  
                  <Button type="submit" className="w-full font-mono" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              )}

              {/* Register Form */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama Lengkap</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Nomor Telepon</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full font-mono" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      'Daftar'
                    )}
                  </Button>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {activeTab === 'login' ? (
                  <>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab('register')}
                    >
                      Daftar sekarang
                    </button>
                  </>
                ) : (
                  <>
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setActiveTab('login')}
                    >
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
