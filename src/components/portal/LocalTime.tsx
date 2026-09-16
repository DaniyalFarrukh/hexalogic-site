'use client'

import { useEffect, useState } from 'react'

interface LocalTimeProps {
  utcString: string | null | undefined
  timezone?: string
  formatOptions?: Intl.DateTimeFormatOptions
  fallback?: string
}

export default function LocalTime({ 
  utcString, 
  timezone, 
  formatOptions = { dateStyle: 'medium' },
  fallback = 'TBD'
}: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string>('')
  
  useEffect(() => {
    if (!utcString) {
      setFormatted(fallback)
      return
    }

    try {
      const date = new Date(utcString)
      
      const options: Intl.DateTimeFormatOptions = { ...formatOptions }
      if (timezone) {
        options.timeZone = timezone
      }
      // If timezone is undefined, it falls back to the browser's local timezone automatically
      
      setFormatted(new Intl.DateTimeFormat('en-US', options).format(date))
    } catch (e) {
      setFormatted(fallback)
    }
  }, [utcString, timezone, formatOptions, fallback])

  // To prevent hydration mismatch, we render empty or fallback on the server, 
  // and update on the client.
  if (!formatted) {
    return <span className="opacity-0">{fallback}</span>
  }

  return <span>{formatted}</span>
}
