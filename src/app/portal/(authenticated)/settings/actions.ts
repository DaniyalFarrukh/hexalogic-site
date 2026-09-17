'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type EmailPrefs = {
  every_update: boolean
  weekly_digest: boolean
}

function isValidTimezone(tz: string) {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz })
    return true
  } catch {
    return false
  }
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const timezone = String(formData.get('timezone') || 'UTC')
  const fullName = String(formData.get('full_name') || '').trim().slice(0, 120)
  const emailPrefsStr = String(formData.get('email_prefs') || '')

  if (!isValidTimezone(timezone)) return { error: 'Please choose a valid timezone' }

  let emailPrefs: EmailPrefs
  try {
    const parsed = JSON.parse(emailPrefsStr) as Partial<EmailPrefs>
    emailPrefs = {
      every_update: parsed.every_update === true,
      weekly_digest: parsed.weekly_digest === true,
    }
  } catch {
    return { error: 'Invalid email preferences format' }
  }

  // Keep the existing avatar and fall back to the stored name if none was provided.
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const { error } = await supabase.rpc('update_own_profile', {
    p_full_name: fullName || profile?.full_name || '',
    p_avatar_url: profile?.avatar_url || '',
    p_timezone: timezone,
    p_email_prefs: emailPrefs
  })

  if (error) {
    console.error('Error updating settings:', error)
    return { error: error.message }
  }

  revalidatePath('/portal', 'layout')
  return { success: true }
}
