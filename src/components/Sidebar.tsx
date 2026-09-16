'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Map, 
  Users, 
  FileText, 
  Settings,
  Bell,
  LogOut
} from 'lucide-react'

export default function Sidebar({ 
  mode = 'admin',
  userEmail = '',
  userName = ''
}: { 
  mode?: 'admin' | 'client',
  userEmail?: string,
  userName?: string
}) {
  const pathname = usePathname()
  const basePath = mode === 'admin' ? '/admin' : '/portal'
  
  const isDark = false // Force light theme everywhere

  // Extract project slug if we are on a project page (e.g. /portal/my-project)
  const segments = pathname?.split('/') || []
  let projectSlug = ''
  if (segments.length >= 3 && segments[1] === (mode === 'admin' ? 'admin' : 'portal') && segments[2] !== 'settings') {
    projectSlug = segments[2]
  }

  // Base URL for project-specific tabs
  const projectBase = projectSlug ? `${basePath}/${projectSlug}` : basePath

  type NavItem = { name: string; href: string; icon: any; badge?: string | number }

  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
    ...(projectSlug ? [
      { name: 'Overview', href: `${projectBase}`, icon: Briefcase },
      { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
      { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
      { name: 'Files', href: `${projectBase}/files`, icon: FileText },
    ] : [
      { name: 'Projects', href: `${basePath}#projects`, icon: Briefcase }, 
      { name: 'Clients', href: `${basePath}#clients`, icon: Users },
    ]),
    { name: 'Settings', href: `${basePath}`, icon: Settings },
  ]

  const clientNavItems: NavItem[] = [
    { name: 'Dashboard', href: basePath, icon: LayoutDashboard },
    ...(projectSlug ? [
      { name: 'Messages', href: `${projectBase}/messages`, icon: MessageSquare },
      { name: 'Milestones', href: `${projectBase}/milestones`, icon: Map },
      { name: 'Files', href: `${projectBase}/files`, icon: FileText },
    ] : []),
    { name: 'Settings', href: `${basePath}/settings`, icon: Settings },
  ]

  const navItems = mode === 'admin' ? adminNavItems : clientNavItems

  return (
    <div className={`w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 border-r ${isDark ? 'bg-surface-darker border-white/10 text-white' : 'bg-surface-light border-gray-200 text-gray-900'}`}>
      
      {/* Logo */}
      <div className="p-6">
        <Link href={basePath} className="flex items-center gap-2 group">
          <Image 
            src="/hexalogic-logo.png" 
            alt="HexaLogic Tech Logo" 
            width={150} 
            height={40} 
            className="w-auto h-14 object-contain"
            priority
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {navItems.map((item) => {
          // Exact match for dashboard, prefix match for others to keep them active when in sub-pages
          let isActive = false
          if (item.name === 'Dashboard') {
            isActive = pathname === basePath
          } else if (item.name === 'Overview' || item.name === 'Projects' || item.name === 'Clients') {
            // These should be exact matches to avoid overlapping sub-pages
            isActive = pathname === item.href
          } else if (item.href !== basePath && item.href !== '#') {
            isActive = pathname?.startsWith(item.href) || false
          }

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? (isDark ? 'bg-brand-secondary text-white shadow-[0_0_15px_rgba(255,115,36,0.3)]' : 'bg-brand-secondary text-white shadow-md')
                  : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5')
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : (isDark ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600')}`} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-red-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* User Profile */}
      <div className={`p-4 mt-auto border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
            {userName ? userName.substring(0, 2).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName || 'User'}</p>
            <p className={`text-xs truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{userEmail}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className={`p-2 rounded-lg transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'}`}>
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
