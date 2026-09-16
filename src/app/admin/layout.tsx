import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ChangePasswordPage from './change-password/page'
import { Toaster } from 'react-hot-toast'
import AdminNotifications from '@/components/admin/AdminNotifications'
import Sidebar from '@/components/Sidebar'
import NotificationsDropdown from '@/components/portal/NotificationsDropdown'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, render children directly (login page)
  if (!user) {
    return <>{children}</>
  }

  // Double-enforce admin role (even though middleware checks it, this ensures absolute safety)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') {
    redirect('/portal')
  }

  return (
    <div className="h-screen overflow-hidden bg-surface-light text-gray-900 flex font-sans">
      <AdminNotifications />
      <Toaster />
      
      {/* Sidebar */}
      <Sidebar mode="admin" userEmail={user.email} userName={profile?.full_name} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-end px-8 border-b border-gray-200 bg-white/95 sticky top-0 z-40 backdrop-blur">
          <div className="flex items-center gap-4">
            <NotificationsDropdown />
          </div>
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

