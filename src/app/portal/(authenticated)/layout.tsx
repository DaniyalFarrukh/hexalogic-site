import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/components/Sidebar'
import MobileBottomNav from '@/components/MobileBottomNav'
import NotificationsDropdown from '@/components/portal/NotificationsDropdown'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

export const metadata: Metadata = {
  title: {
    default: 'Client Portal',
    template: '%s — HexaLogic Portal',
  },
  robots: { index: false, follow: false },
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/portal/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const mustChangePassword = user.user_metadata?.force_password_change === true

  return (
    <div className="h-dvh overflow-hidden bg-surface-light text-gray-900 flex font-sans">
      <Toaster position="bottom-right" />

      {/* Sidebar - Desktop Only */}
      <div className="hidden md:flex">
        <Sidebar mode="client" userEmail={user.email} userName={profile?.full_name} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-0">
        <header className="h-16 flex items-center justify-between md:justify-end px-4 md:px-8 border-b border-gray-200 bg-white/95 sticky top-0 z-40 backdrop-blur">
          <span className="md:hidden text-sm font-bold tracking-wider text-gray-900">
            HEXALOGIC <span className="text-brand-primary">PORTAL</span>
          </span>
          <div className="flex items-center gap-4">
            <NotificationsDropdown mode="client" />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          {mustChangePassword ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <ChangePasswordForm audience="client" />
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
