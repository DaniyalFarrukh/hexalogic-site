'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  // We must use the update_own_profile RPC to respect RLS
  const timezone = formData.get('timezone') as string
  const fullName = formData.get('full_name') as string
  const emailPrefsStr = formData.get('email_prefs') as string
  
  let emailPrefs: any;
  try {
    emailPrefs = JSON.parse(emailPrefsStr);
  } catch (e) {
    return { error: 'Invalid email preferences format' };
  }

  // Fetch existing profile to retain avatar_url (and fallback for full_name)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  const { error } = await supabase.rpc('update_own_profile', {
    p_full_name: fullName || profile?.full_name || '',
    p_avatar_url: profile?.avatar_url || '',
    p_timezone: timezone || 'UTC',
    p_email_prefs: emailPrefs
  })

  if (error) {
    console.error('Error updating settings:', error)
    return { error: error.message }
  }

  revalidatePath('/portal/settings')
  return { success: true }
}
