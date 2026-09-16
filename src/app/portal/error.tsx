'use client'

import { useEffect } from 'react'

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Portal Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-surface-darkest flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-dark border border-white/10 rounded-2xl p-8 text-center shadow-[0_20px_60px_rgba(15,44,76,0.08)]">
        <div className="flex justify-center mb-6 text-red-500">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-gray-400 text-sm mb-8">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-brand-primary text-white font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-brand-primary/90"
          >
            Try Again
          </button>
          <a
            href="mailto:support@hexalogic.com"
            className="block w-full bg-surface-darkest border border-white/10 text-white font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-slate/10"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  )
}
