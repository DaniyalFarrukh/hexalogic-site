'use client'

import { useState } from 'react'
import { adminLogin } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    try {
      const res = await adminLogin(formData)
      if (res?.error) {
        setError(res.error)
        setLoading(false)
      }
    } catch (error) {
      // Allow Next.js redirect to propagate
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-surface-darkest flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-dark border border-white/10 rounded-2xl p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-white font-bold text-xl tracking-wider">HEXALOGIC</span>
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
          </div>
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Admin Console</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {error}
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
              placeholder="admin@hexalogic.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-primary text-white text-sm font-bold hover:bg-[#ff8947] rounded-lg px-4 py-3 transition-all shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Restricted Access</p>
        </div>
      </div>
    </div>
  )
}
