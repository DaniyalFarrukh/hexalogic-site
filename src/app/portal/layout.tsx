import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'

import ChangePasswordPage from './change-password/page'
import Sidebar from '@/components/Sidebar'
import NotificationsDropdown from '@/components/portal/NotificationsDropdown'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Allow unauthenticated access to login and forgot-password pages
  const headersList = await headers()
  const url = headersList.get('x-url') || headersList.get('x-invoke-path') || ''
  
  // Use a simpler approach: check if we're on a public route by looking at the referer/path
  // For Next.js App Router, we check the pathname from the request
  const isPublicRoute = typeof url === 'string' && (
    url.includes('/portal/login') || 
    url.includes('/portal/forgot-password') ||
    url.includes('/portal/reset-password')
  )

  // If not authenticated and not on a public route, redirect to login
  if (!user && !isPublicRoute) {
    // We need to check if this is a public page — since Next.js layouts wrap all nested routes,
    // we cannot block login/forgot-password. The children themselves will render,
    // but the navbar won't show the user info.
  }

  // Fetch profile if user exists
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    profile = data
  }

  // If on a public route and not logged in, just show content without sidebar
  if (!user && isPublicRoute) {
    return (
      <div className="h-screen overflow-hidden bg-surface-light text-gray-900 flex flex-col font-sans">
        <main className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-surface-light text-gray-900 flex font-sans">
      {/* Sidebar */}
      {user && (
        <Sidebar mode="client" userEmail={user.email} userName={profile?.full_name} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-end px-8 border-b border-gray-200 bg-white/95 sticky top-0 z-40 backdrop-blur">
          {user && (
            <div className="flex items-center gap-4">
              <NotificationsDropdown />
            </div>
          )}
        </header>
        
        <div className="flex-1 p-8">
          {user?.user_metadata?.force_password_change ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <ChangePasswordPage />
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  )
}
