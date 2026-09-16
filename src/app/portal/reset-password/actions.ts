'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string

  if (!password) {
    return { error: 'Password is required' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const supabase = await createClient()

  // Verify the user is authenticated (they should be after clicking the reset link)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized or session expired. Please request a new link.' }
  }

  // Update password and clear force_password_change flag
  const { error } = await supabase.auth.updateUser({
    password,
    data: { force_password_change: false }
  })

  if (error) {
    return { error: error.message }
  }

  // Determine redirect based on role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role === 'admin') {
    redirect('/admin')
  } else {
    redirect('/portal')
  }
}
