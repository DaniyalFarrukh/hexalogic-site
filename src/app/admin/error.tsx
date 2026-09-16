'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-white/10 rounded-2xl p-8 text-center shadow-lg">
        <div className="flex justify-center mb-6 text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Admin Dashboard Error</h2>
        <p className="text-gray-400 text-sm mb-8">
          An unexpected error occurred while loading the dashboard.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-surface-darkest text-white font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-surface-dark"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="block w-full bg-white border border-white/10 text-navy font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-slate/10"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
