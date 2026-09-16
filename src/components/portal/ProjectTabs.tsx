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
    <div className="flex items-center gap-8 border-b border-gray-100 px-8">
      {tabs.map(t => {
        const href = `/portal/${projectSlug}/${t}`
        const isActive = pathname === href || pathname?.startsWith(href + '/')
        
        return (
          <Link 
            key={t}
            href={href}
            className={`py-5 text-sm font-bold capitalize relative transition-colors ${
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
