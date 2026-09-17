'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Map,
  FileText,
  Settings,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react'
import { getProjectSlugFromPath } from '@/lib/navigation'

type NavItem = { name: string; href: string; icon: LucideIcon; exact?: boolean }

export default function MobileBottomNav({
  mode = 'admin'
}: {
  mode?: 'admin' | 'client'
}) {
  const pathname = usePathname() || ''
  const basePath = mode === 'admin' ? '/admin' : '/portal'
  const projectSlug = getProjectSlugFromPath(pathname, mode)
  const projectBase = projectSlug ? `${basePath}/${projectSlug}` : basePath

  let navItems: NavItem[]

  if (projectSlug) {
    navItems = mode === 'admin'
      ? [
          { name: 'Home', href: basePath, icon: LayoutDashboard, exact: true },
          { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
          { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
          { name: 'Updates', href: `${projectBase}/updates`, icon: Briefcase },
          { name: 'Files', href: `${projectBase}/files`, icon: FileText },
        ]
      : [
          { name: 'Home', href: basePath, icon: LayoutDashboard, exact: true },
          { name: 'Updates', href: `${projectBase}/updates`, icon: Briefcase },
          { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
          { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
          { name: 'Files', href: `${projectBase}/files`, icon: FileText },
        ]
  } else {
    navItems = mode === 'admin'
      ? [
          { name: 'Dashboard', href: basePath, icon: LayoutDashboard, exact: true },
          { name: 'New Project', href: `${basePath}/new`, icon: PlusCircle, exact: true },
        ]
      : [
          { name: 'Dashboard', href: basePath, icon: LayoutDashboard, exact: true },
          { name: 'Settings', href: `${basePath}/settings`, icon: Settings },
        ]
  }

  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 min-w-[44px] transition-colors ${
                isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
