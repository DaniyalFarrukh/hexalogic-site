'use client'

import { useSyncExternalStore } from 'react'

const noopSubscribe = () => () => {}

/**
 * True once the component has hydrated on the client. Safe replacement for the
 * "mounted" state pattern, and it never triggers a setState inside an effect.
 */
export function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

function subscribeToMedia(query: string) {
  return (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const mql = window.matchMedia(query)
    mql.addEventListener('change', callback)
    return () => mql.removeEventListener('change', callback)
  }
}

/** Reactive media query. Returns `false` during server rendering. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribeToMedia(query),
    () => window.matchMedia(query).matches,
    () => false
  )
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
