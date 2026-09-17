'use client'

import { useState } from 'react'
import { updateSettings } from './actions'

export function SettingsForm({ initialFullName, initialTimezone, initialPrefs }: { initialFullName: string, initialTimezone: string, initialPrefs: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(initialFullName)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [everyUpdate, setEveryUpdate] = useState(initialPrefs.every_update === true)
  const [weeklyDigest, setWeeklyDigest] = useState(initialPrefs.weekly_digest === true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('full_name', fullName)
    formData.append('timezone', timezone)
    formData.append('email_prefs', JSON.stringify({
      every_update: everyUpdate,
      weekly_digest: weeklyDigest
    }))

    const result = await updateSettings(formData)
    
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name or business name"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">This is the name that will appear on your comments and updates.</p>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 relative flex items-center justify-center">
              <input 
                type="checkbox" 
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm bg-white checked:bg-brand-primary checked:border-brand-primary transition-colors"
                checked={everyUpdate}
                onChange={(e) => setEveryUpdate(e.target.checked)}
              />
              <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-gray-900 font-medium group-hover:text-brand-primary transition-colors">Instant Updates</div>
              <div className="text-sm text-gray-500">Receive an email immediately when a new project update is posted.</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 relative flex items-center justify-center">
              <input 
                type="checkbox" 
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-sm bg-white checked:bg-brand-primary checked:border-brand-primary transition-colors"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
              />
              <svg className="absolute w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white" viewBox="0 0 14 10" fill="none">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-gray-900 font-medium group-hover:text-brand-primary transition-colors">Weekly Digest <span className="text-brand-primary text-xs ml-2 px-2 py-0.5 rounded-full bg-brand-primary/10">(Coming soon)</span></div>
              <div className="text-sm text-gray-500">A summary of the week's progress sent every Friday.</div>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Localization</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select 
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Chicago">Central Time (CT)</option>
          <option value="America/Denver">Mountain Time (MT)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
          <option value="Europe/London">London (GMT/BST)</option>
          <option value="Europe/Paris">Central European Time (CET)</option>
          <option value="Asia/Dubai">Dubai (GST)</option>
          <option value="Asia/Tokyo">Tokyo (JST)</option>
          <option value="Australia/Sydney">Sydney (AEST)</option>
        </select>
      </div>

      <div className="pt-6">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
        {success && <p className="mt-3 text-sm text-brand-primary">Settings saved successfully!</p>}
      </div>
    </form>
  )
}
