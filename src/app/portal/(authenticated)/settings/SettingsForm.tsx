'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { updateSettings, type EmailPrefs } from './actions'

const FALLBACK_TIMEZONES = [
  'UTC',
  'Asia/Karachi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Sao_Paulo',
]

function getTimezones(current: string) {
  let zones: string[] = FALLBACK_TIMEZONES
  try {
    const supported = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.('timeZone')
    if (supported && supported.length > 0) zones = supported
  } catch {
    // keep fallback
  }
  if (current && !zones.includes(current)) zones = [current, ...zones]
  return zones
}

export function SettingsForm({
  initialFullName,
  initialTimezone,
  initialPrefs
}: {
  initialFullName: string
  initialTimezone: string
  initialPrefs: Partial<EmailPrefs>
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(initialFullName)
  const [timezone, setTimezone] = useState(initialTimezone)
  const [everyUpdate, setEveryUpdate] = useState(initialPrefs.every_update !== false)

  const timezones = useMemo(() => getTimezones(initialTimezone), [initialTimezone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('full_name', fullName)
    formData.append('timezone', timezone)
    formData.append('email_prefs', JSON.stringify({
      every_update: everyUpdate,
      weekly_digest: initialPrefs.weekly_digest === true
    }))

    const result = await updateSettings(formData)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      toast.success('Settings saved')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Profile</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name or business name"
              autoComplete="name"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">This is the name that will appear on your comments and messages.</p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded border-gray-300 accent-brand-primary"
              checked={everyUpdate}
              onChange={(e) => setEveryUpdate(e.target.checked)}
            />
            <div>
              <div className="text-gray-900 font-medium group-hover:text-brand-primary transition-colors">Instant Updates</div>
              <div className="text-sm text-gray-500">Receive an email as soon as a project update or milestone is posted.</div>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-not-allowed opacity-60">
            <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300" checked={false} disabled readOnly />
            <div>
              <div className="text-gray-900 font-medium">
                Weekly Digest
                <span className="text-brand-primary text-xs ml-2 px-2 py-0.5 rounded-full bg-brand-primary/10">Coming soon</span>
              </div>
              <div className="text-sm text-gray-500">A summary of the week&apos;s progress, sent every Friday.</div>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Localization</h3>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
        >
          {timezones.map(tz => (
            <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">Used for dates in email notifications. The portal itself shows times in your device&apos;s timezone.</p>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-primary hover:bg-[#ff8947] text-white font-medium py-2.5 px-6 min-h-[44px] rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  )
}
