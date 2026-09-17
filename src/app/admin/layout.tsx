import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import AdminNotifications from '@/components/admin/AdminNotifications'
import Sidebar from '@/components/Sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import NotificationsDropdown from '@/components/portal/NotificationsDropdown'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

export const metadata: Metadata = {
  title: {
    default: 'Admin Console',
    template: '%s — HexaLogic Admin',
  },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated: render children directly (the login page)
  if (!user) {
    return <>{children}</>
  }

  // Double-enforce the admin role (the proxy also checks it)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    redirect('/portal')
  }

  const mustChangePassword = user.user_metadata?.force_password_change === true

  return (
    <div className="h-dvh overflow-hidden bg-surface-light text-gray-900 flex font-sans">
      <AdminNotifications />
      <Toaster position="bottom-right" />

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex">
        <Sidebar mode="admin" userEmail={user.email} userName={profile?.full_name} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-0">
        <header className="h-16 flex items-center justify-between md:justify-end px-4 md:px-8 border-b border-gray-200 bg-white/95 sticky top-0 z-40 backdrop-blur">
          <span className="md:hidden text-sm font-bold tracking-wider text-gray-900">
            HEXALOGIC <span className="text-brand-primary">ADMIN</span>
          </span>
          <div className="flex items-center gap-4">
            <NotificationsDropdown mode="admin" />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          {mustChangePassword ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <ChangePasswordForm audience="admin" />
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav mode="admin" />
    </div>
  )
}
