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
    <div className="flex items-center gap-6 md:gap-8 border-b border-gray-200 px-4 md:px-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabs.map(t => {
        const href = `/admin/${projectSlug}/${t}`
        const isActive = pathname === href || pathname?.startsWith(href + '/')

        return (
          <Link 
            key={t}
            href={href}
            className={`py-6 text-sm font-bold uppercase tracking-wider relative transition-colors ${
              isActive ? 'text-brand-secondary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-secondary rounded-t-full shadow-[0_0_10px_rgba(255,115,36,0.5)]" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
