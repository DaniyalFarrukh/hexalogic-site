import type { Metadata } from 'next'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'

export const metadata: Metadata = {
  title: 'Set a new password',
}

export default function PortalChangePasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <ChangePasswordForm audience="client" />
    </div>
  )
}
