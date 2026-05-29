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
    .maybeSingle()
  return !!data
}

async function ensureUserProfile(
  userId: string,
  name: string,
  email: string,
  phone: string,
): Promise<AuthResult> {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (existing) return { error: null }

  const { error } = await supabase.from('users').insert({
    id: userId,
    name,
    email,
    phone,
  })

  if (error) {
    if (error.message.includes('duplicate key')) return { error: null }
    console.error('[auth] profile insert failed:', error.message)
    return { error: mapSupabaseAuthError(error) }
  }

  return { error: null }
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) return { error: null }
    return { error: mapSupabaseAuthError(error) }
  } catch (e) {
    return { error: mapSupabaseAuthError(e) }
  }
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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
    },
  })

  if (error) {
    return { error: mapSupabaseAuthError(error) }
  }

  if (!data.user) {
    return { error: 'Registrasi gagal, silakan coba lagi' }
  }

  return ensureUserProfile(data.user.id, name, email, phone)
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

function mapSupabaseAuthError(error: unknown): string {
  const msg = (error as { message?: string })?.message ?? ''
  if (msg.includes('Email not confirmed')) return 'Email belum diverifikasi, cek inbox email kamu'
  if (msg.includes('Invalid login credentials') || msg.includes('Credentials error')) {
    return 'Email atau password salah'
  }
  if (msg.includes('duplicate key')) return 'Email sudah terdaftar, gunakan email lain'
  if (msg.includes('row-level security policy')) {
    return 'Gagal menyimpan profil. Hubungi admin atau coba lagi.'
  }
  return 'Terjadi kesalahan pada server, silakan coba beberapa saat lagi'
}
