'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Portal Error:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] bg-surface-light flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="flex justify-center mb-6 text-red-500">
          <AlertTriangle className="w-12 h-12" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-8">
          We hit an unexpected error loading this page. Please try again, and contact us if it keeps happening.
        </p>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full bg-brand-primary text-white font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-[#ff8947]"
          >
            Try Again
          </button>
          <Link
            href="/portal"
            className="block w-full bg-white border border-gray-200 text-gray-700 font-bold tracking-wider rounded-lg px-4 py-3 transition-colors hover:bg-gray-50"
          >
            Back to Portal
          </Link>
          <Link href="/contact" className="block text-xs text-gray-500 hover:text-brand-primary pt-2">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  )
}
