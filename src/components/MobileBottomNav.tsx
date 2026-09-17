'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Map, 
  Users, 
  FileText, 
  Settings
} from 'lucide-react'

export default function MobileBottomNav({ 
  mode = 'admin'
}: { 
  mode?: 'admin' | 'client'
}) {
  const pathname = usePathname()
  const basePath = mode === 'admin' ? '/admin' : '/portal'
  
  // Extract project slug if we are on a project page
  const segments = pathname?.split('/') || []
  let projectSlug = ''
  if (segments.length >= 3 && segments[1] === (mode === 'admin' ? 'admin' : 'portal') && segments[2] !== 'settings') {
    projectSlug = segments[2]
  }

  const projectBase = projectSlug ? `${basePath}/${projectSlug}` : basePath

  // Determine which icons to show on mobile (max 5)
  let navItems = []
  
  if (projectSlug) {
    // We are inside a project view
    navItems = [
      { name: 'Home', href: basePath, icon: LayoutDashboard },
      { name: 'Overview', href: `${projectBase}`, icon: Briefcase },
      { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
      { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
      { name: 'Files', href: `${projectBase}/files`, icon: FileText },
    ]
    // If client, remove overview
    if (mode === 'client') {
      navItems = navItems.filter(item => item.name !== 'Overview')
      navItems.push({ name: 'Settings', href: `${basePath}/settings`, icon: Settings })
    }
  } else {
    // General dashboard view
    navItems = [
      { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
      ...(mode === 'admin' ? [
        { name: 'Projects', href: `${basePath}#projects`, icon: Briefcase }, 
        { name: 'Clients', href: `${basePath}#clients`, icon: Users },
      ] : []),
      { name: 'Settings', href: mode === 'admin' ? `${basePath}` : `${basePath}/settings`, icon: Settings }
    ]
  }

  // Ensure max 5 items for bottom nav
  navItems = navItems.slice(0, 5)

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          let isActive = false
          if (item.name === 'Dashboard' || item.name === 'Home') {
            isActive = pathname === basePath
          } else if (item.name === 'Overview' || item.name === 'Projects' || item.name === 'Clients' || item.name === 'Settings') {
            isActive = pathname === item.href
          } else if (item.href !== basePath && item.href !== '#') {
            isActive = pathname?.startsWith(item.href) || false
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'fill-brand-primary/10' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
