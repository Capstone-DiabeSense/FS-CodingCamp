import { supabase } from '@/lib/supabase'

export interface AuthResult {
  error: string | null
}

export interface RegisterParams {
  name: string
  email: string
  phone: string
  password: string
}

async function checkEmailExists(email: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .single()
  return !!data
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const exists = await checkEmailExists(email)
  if (!exists) {
    return { error: 'Akun belum terdaftar, silakan daftar terlebih dahulu' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (!error) return { error: null }
  if (error.message.includes('Email not confirmed')) {
    return { error: 'Email belum diverifikasi, cek inbox email kamu' }
  }
  return { error: 'Password salah, silahkan coba lagi' }
}

export async function registerWithEmail({
  name,
  email,
  phone,
  password,
}: RegisterParams): Promise<AuthResult> {
  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
    },
  })

  if (error) {
    return { error: 'Email sudah terdaftar atau terjadi kesalahan' }
  }
  return { error: null }
}

export async function sendResetPasswordEmail(email: string): Promise<AuthResult> {
  const exists = await checkEmailExists(email)
  if (!exists) {
    return { error: 'Email tidak terdaftar, silakan daftar terlebih dahulu' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) return { error: 'Gagal mengirim email, coba lagi' }
  return { error: null }
}