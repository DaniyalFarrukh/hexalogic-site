import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

import ChangePasswordPage from './change-password/page'
import Sidebar from '@/components/Sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import NotificationsDropdown from '@/components/portal/NotificationsDropdown'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/portal/login')
  }

  // Fetch profile if user exists
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  return (
    <div className="h-screen overflow-hidden bg-surface-light text-gray-900 flex font-sans pb-16 md:pb-0">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex">
        <Sidebar mode="client" userEmail={user.email} userName={profile?.full_name} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-end px-4 md:px-8 border-b border-gray-200 bg-white/95 sticky top-0 z-40 backdrop-blur">
          <div className="flex items-center gap-4">
            <NotificationsDropdown />
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8">
          {user?.user_metadata?.force_password_change ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <ChangePasswordPage />
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav mode="client" />
    </div>
  )
}
