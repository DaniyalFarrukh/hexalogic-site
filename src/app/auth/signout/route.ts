import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  // Check where the user came from to redirect back appropriately
  const referer = request.headers.get('referer') || ''
  const isAdmin = referer.includes('/admin')
  
  await supabase.auth.signOut()

  const redirectTo = isAdmin ? '/admin/login' : '/portal/login'
  return NextResponse.redirect(new URL(redirectTo, request.url), {
    status: 302,
  })
}
