import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsForm } from './SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email_prefs, timezone')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/portal')
  }

  return (
    <div className="max-w-3xl mx-auto w-full p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account preferences and notifications.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <SettingsForm 
          initialFullName={profile.full_name || ''}
          initialTimezone={profile.timezone || 'UTC'} 
          initialPrefs={profile.email_prefs || { every_update: true }} 
        />
      </div>
    </div>
  )
}
