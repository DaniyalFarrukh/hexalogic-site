'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

const THEME_KEY = 'hexalogic_theme'

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null)

export function ThemeProvider({ children, className }: { children: ReactNode; className?: string }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Defer so the initial read never sets state synchronously inside the effect body.
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(THEME_KEY)
        if (stored === 'dark') setTheme('dark')
      } catch {
        // storage unavailable
      }
    })
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // storage unavailable
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark' : undefined}>
        <div className={className}>
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
