'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, type FocusEvent } from 'react'
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Map,
  FileText,
  Settings,
  LogOut,
  PlusCircle,
  type LucideIcon,
} from 'lucide-react'
import { getProjectSlugFromPath } from '@/lib/navigation'

type NavItem = { name: string; href: string; icon: LucideIcon; exact?: boolean }

export default function Sidebar({
  mode = 'admin',
  userEmail = '',
  userName = ''
}: {
  mode?: 'admin' | 'client',
  userEmail?: string,
  userName?: string
}) {
  const pathname = usePathname() || ''
  const [expanded, setExpanded] = useState(false)
  const collapsed = !expanded

  // Keyboard users tabbing through the nav should see it expand too, but only
  // collapse once focus actually leaves the sidebar (not between its own links).
  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setExpanded(false)
  }

  const basePath = mode === 'admin' ? '/admin' : '/portal'
  const projectSlug = getProjectSlugFromPath(pathname, mode)
  const projectBase = projectSlug ? `${basePath}/${projectSlug}` : basePath

  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard, exact: true },
    ...(projectSlug ? [
      { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
      { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
      { name: 'Updates', href: `${projectBase}/updates`, icon: Briefcase },
      { name: 'Files', href: `${projectBase}/files`, icon: FileText },
    ] : [
      { name: 'New Project', href: `${basePath}/new`, icon: PlusCircle, exact: true },
    ]),
  ]

  const clientNavItems: NavItem[] = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard, exact: true },
    ...(projectSlug ? [
      { name: 'Updates', href: `${projectBase}/updates`, icon: Briefcase },
      { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
      { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
      { name: 'Files', href: `${projectBase}/files`, icon: FileText },
    ] : []),
    { name: 'Settings', href: `${basePath}/settings`, icon: Settings },
  ]

  const navItems = mode === 'admin' ? adminNavItems : clientNavItems

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col h-screen sticky top-0 border-r bg-surface-light border-gray-200 text-gray-900 transition-[width] duration-200 overflow-hidden`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={handleBlur}
    >
      {/* Logo */}
      <div className={`p-6 ${collapsed ? 'px-0 flex justify-center' : ''}`}>
        <Link href={basePath} className="flex items-center gap-2 group" aria-label="Go to dashboard">
          <Image
            src="/hexalogic-logo.png"
            alt="HexaLogic Tech Logo"
            width={150}
            height={40}
            className={`${collapsed ? 'w-10' : 'w-auto'} h-14 object-contain`}
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1" aria-label="Main">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${collapsed ? 'justify-center px-0' : ''} ${
                isActive
                  ? 'bg-brand-secondary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto border-t border-gray-200">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'}`}>
          <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
            {userName ? userName.substring(0, 2).toUpperCase() : 'U'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userName || 'User'}</p>
              <p className="text-xs truncate text-gray-500">{userEmail}</p>
            </div>
          )}
          {/* One persistent form/button regardless of collapsed state — swapping between two
              separate elements dropped focus if a keyboard user Shift+Tabbed straight into the
              collapsed-only button just as expansion unmounted it. */}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-900 hover:bg-black/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
