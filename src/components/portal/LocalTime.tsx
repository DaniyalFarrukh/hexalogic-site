'use client'

import { useHydrated } from '@/lib/hooks'

interface LocalTimeProps {
  utcString: string | null | undefined
  timezone?: string
  formatOptions?: Intl.DateTimeFormatOptions
  fallback?: string
}

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }

function formatLocal(utcString: string, formatOptions: Intl.DateTimeFormatOptions, timezone?: string) {
  try {
    const date = new Date(utcString)
    if (Number.isNaN(date.getTime())) return null
    const options: Intl.DateTimeFormatOptions = { ...formatOptions }
    if (timezone) options.timeZone = timezone
    return { iso: date.toISOString(), text: new Intl.DateTimeFormat('en-US', options).format(date) }
  } catch {
    return null
  }
}

/**
 * Renders a date in the visitor's local timezone. The server renders an
 * invisible placeholder so hydration never mismatches.
 */
export default function LocalTime({
  utcString,
  timezone,
  formatOptions = DEFAULT_FORMAT,
  fallback = 'TBD'
}: LocalTimeProps) {
  const hydrated = useHydrated()

  if (!utcString) return <span>{fallback}</span>

  if (!hydrated) {
    return <span className="opacity-0" aria-hidden="true">{fallback}</span>
  }

  const formatted = formatLocal(utcString, formatOptions, timezone)
  if (!formatted) return <span>{fallback}</span>

  return <time dateTime={formatted.iso}>{formatted.text}</time>
}
