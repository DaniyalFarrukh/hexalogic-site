'use client'

import { useState } from 'react'
import { resetPasswordForEmail } from '@/lib/auth/actions'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await resetPasswordForEmail(formData)
    
    if (res?.error) {
      setError(res.error)
    } else if (res?.success) {
      setSuccess(res.success)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-darkest flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-dark border border-white/5 rounded-2xl p-8 shadow-[0_20px_60px_rgba(15,44,76,0.08)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-white font-bold text-xl tracking-wider">HEXALOGIC</span>
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <p className="text-gray-400 text-sm">Reset Password</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors"
              placeholder="client@company.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/portal/login" className="text-xs text-gray-400 hover:text-white transition-colors">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
