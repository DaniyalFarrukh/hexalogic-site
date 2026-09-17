import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Handles links sent by Supabase Auth (password recovery, magic links, invites).
 *
 * Supabase can send two link styles depending on the email template:
 *   - PKCE flow:     /auth/confirm?code=...&next=/portal/reset-password
 *   - Token hash:    /auth/confirm?token_hash=...&type=recovery&next=/portal/reset-password
 *
 * Both are exchanged for a session here, on the server, so the cookies are set
 * before the user lands on the destination page.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const nextParam = searchParams.get('next') || '/portal/reset-password'
  // Only allow same-site relative redirects.
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/portal'

  const supabase = await createClient()
  let errorMessage: string | null = null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) errorMessage = error.message
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) errorMessage = error.message
  } else {
    errorMessage = 'Missing confirmation parameters'
  }

  if (errorMessage) {
    const loginUrl = new URL('/portal/forgot-password', origin)
    loginUrl.searchParams.set('error', 'This link is invalid or has expired. Please request a new one.')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.redirect(new URL(next, origin))
}
