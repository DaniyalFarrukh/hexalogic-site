'use client'

import { useEffect } from 'react'
import { logClientActivity } from '@/app/portal/portal-actions'

export default function ClientActivityTracker() {
  useEffect(() => {
    // 1. Client-side optimization: only attempt to fire if we haven't in the last hour
    const lastFired = localStorage.getItem('last_activity_log')
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    if (!lastFired || now - parseInt(lastFired, 10) > oneHour) {
      // 2. Call server action (which also validates on the DB side)
      logClientActivity().then(res => {
        if (res.success) {
          localStorage.setItem('last_activity_log', now.toString())
        }
      })
    }
  }, [])

  return null
}
