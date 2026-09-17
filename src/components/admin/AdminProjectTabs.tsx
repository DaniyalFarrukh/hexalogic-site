'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminProjectTabs({
  projectSlug,
  tabs
}: {
  projectSlug: string
  tabs: string[]
}) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Project sections"
      className="flex items-center gap-1 md:gap-2 border-b border-gray-200 px-2 md:px-4 overflow-x-auto whitespace-nowrap scrollbar-hide md:flex-wrap md:overflow-visible"
    >
      {tabs.map(t => {
        const href = `/admin/${projectSlug}/${t}`
        const isActive = pathname === href || pathname?.startsWith(href + '/')

        return (
          <Link
            key={t}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3 md:px-4 py-4 md:py-5 text-xs md:text-sm font-bold uppercase tracking-wider relative transition-colors min-h-[44px] flex items-center ${
              isActive ? 'text-brand-secondary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-secondary rounded-t-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
