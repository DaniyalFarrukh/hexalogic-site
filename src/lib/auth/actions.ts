'use server'

import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'
import { SITE_URL } from '@/lib/site'

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
    redirectTo: `${SITE_URL}/auth/confirm?next=/portal/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  // Always return the same message so the form cannot be used to probe which emails exist.
  return { success: 'If an account exists for that email, a reset link is on its way.' }
}
