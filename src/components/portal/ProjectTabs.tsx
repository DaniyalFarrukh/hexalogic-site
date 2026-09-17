'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProjectTabs({ 
  projectSlug,
  tabs 
}: { 
  projectSlug: string
  tabs: string[]
}) {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 sm:gap-2 border-b border-gray-100 px-2 sm:px-4 overflow-x-auto whitespace-nowrap scrollbar-hide md:flex-wrap md:overflow-visible">
      {tabs.map(t => {
        const href = `/portal/${projectSlug}/${t}`
        const isActive = pathname === href || pathname?.startsWith(href + '/')
        
        return (
          <Link 
            key={t}
            href={href}
            className={`px-3 py-4 text-sm font-bold capitalize relative transition-colors min-h-[44px] flex items-center ${
              isActive ? 'text-brand-secondary' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-secondary shadow-[0_0_10px_rgba(255,115,36,0.5)]" />
            )}
          </Link>
        )
      })}
    </div>
  )
}
