'use client'

import { useState } from 'react'
import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // On success the server action redirects.
  }

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors placeholder:text-gray-400'

  return (
    <div className="min-h-screen bg-surface-light flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-1 mb-2" aria-label="HexaLogic home">
            <span className="text-gray-900 font-bold text-xl tracking-wider">HEXALOGIC</span>
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </Link>
          <p className="text-gray-500 text-sm">Client Portal Login</p>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              className={inputClass}
              placeholder="client@company.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link href="/portal/forgot-password" className="text-xs text-gray-500 hover:text-brand-primary transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-brand-primary transition-colors">
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
