'use client'

import { useState } from 'react'
import { resetPassword } from './actions'

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-surface-light flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-gray-900 font-bold text-xl tracking-wider">HEXALOGIC</span>
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <p className="text-gray-500 text-sm">Create New Password</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
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
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors placeholder:text-gray-400"
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
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
