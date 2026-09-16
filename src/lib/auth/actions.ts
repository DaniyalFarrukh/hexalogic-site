'use server'

import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function sharedSignIn(email: string, password: string, rateLimitKey: string) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
  const { success, retryAfter } = rateLimit(`${rateLimitKey}_${ip}`)
  
  if (!success) {
    return { error: `Too many attempts. Try again in ${retryAfter}s.` }
  }

  const supabase = await createClient()
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle()

  const forcePasswordChange = authData.user.user_metadata?.force_password_change === true

  return { success: true, role: profile?.role, forcePasswordChange }
}

export async function resetPasswordForEmail(formData: FormData) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
  const { success, retryAfter } = rateLimit(`reset_${ip}`)
  
  if (!success) {
    return { error: `Too many attempts. Try again in ${retryAfter}s.` }
  }

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/portal/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Check your email for the reset link' }
}
