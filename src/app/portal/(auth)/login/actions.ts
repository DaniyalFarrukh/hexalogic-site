'use server'

import { redirect } from 'next/navigation'
import { sharedSignIn } from '@/lib/auth/actions'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const result = await sharedSignIn(email, password, 'login')

  if (result.error) {
    return { error: result.error }
  }

  // Admin signing in through portal gets directed to admin dashboard
  if (result.role === 'admin') {
    redirect('/admin')
  }

  // Hard redirect server-side
  if (result.forcePasswordChange) {
    redirect('/portal/change-password')
  }

  redirect('/portal')
}

