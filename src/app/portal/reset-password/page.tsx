'use client'

import { useState, useEffect } from 'react'
import { resetPassword } from './actions'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Optional: check if there's a hash in the URL to ensure Supabase auth picked it up
    // Usually Supabase processes the hash automatically in the client side.
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string

    if (password !== confirm) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    const res = await resetPassword(formData)
    
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
    // If successful, resetPassword will redirect
  }

  return (
    <div className="min-h-screen bg-surface-darkest flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-dark border border-white/5 rounded-2xl p-8 shadow-[0_20px_60px_rgba(15,44,76,0.08)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-white font-bold text-xl tracking-wider">HEXALOGIC</span>
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <p className="text-gray-400 text-sm">Create New Password</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Password</label>
            <input 
              type="password" 
              name="password"
              required
              minLength={6}
              className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm Password</label>
            <input 
              type="password" 
              name="confirm_password"
              required
              minLength={6}
              className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
