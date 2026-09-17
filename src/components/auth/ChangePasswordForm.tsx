'use client'

import { useId, useState } from 'react'
import { resetPassword } from '@/app/portal/(auth)/reset-password/actions'

export const MIN_PASSWORD_LENGTH = 8

export default function ChangePasswordForm({
  audience = 'client',
  heading = 'Welcome!',
}: {
  audience?: 'admin' | 'client'
  heading?: string
}) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const id = useId()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = String(formData.get('password') || '')
    const confirm = String(formData.get('confirm_password') || '')

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const res = await resetPassword(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // On success the action redirects.
  }

  const inputClass =
    'w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors placeholder:text-gray-400'

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="flex flex-col mb-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{heading}</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          For your security, please set a new password before accessing {audience === 'admin' ? 'the admin console' : 'your project portal'}.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor={`${id}-password`} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Password</label>
          <input
            id={`${id}-password`}
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor={`${id}-confirm`} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm Password</label>
          <input
            id={`${id}-confirm`}
            type="password"
            name="confirm_password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClass}
            placeholder="Repeat your new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Saving...' : 'Set Password & Continue'}
        </button>
      </form>
    </div>
  )
}
