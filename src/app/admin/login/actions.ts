'use server'

import { redirect } from 'next/navigation'
import { sharedSignIn } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const result = await sharedSignIn(email, password, 'admin_login')

  if (result.error) {
    return { error: result.error }
  }

  if (result.role !== 'admin') {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return { error: 'Access denied. Admin credentials required.' }
  }

  // Role is admin, perform hard redirect server-side
  if (result.forcePasswordChange) {
    redirect('/admin/change-password')
  }

  redirect('/admin')
}
