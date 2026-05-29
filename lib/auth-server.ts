import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'

export async function verifyAuthToken(token: string): Promise<User | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return null
  return data.user
}

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice(7)
}
