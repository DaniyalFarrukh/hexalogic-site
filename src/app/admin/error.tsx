'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

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
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="flex justify-center mb-6 text-red-500">
          <AlertTriangle className="w-12 h-12" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard Error</h2>
        <p className="text-gray-500 text-sm mb-2">
          An unexpected error occurred while loading this page.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-6 font-mono">Reference: {error.digest}</p>
        )}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full bg-brand-primary text-white font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-[#ff8947]"
          >
            Try Again
          </button>
          <Link
            href="/admin"
            className="block w-full bg-white border border-gray-200 text-gray-700 font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-gray-50"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
