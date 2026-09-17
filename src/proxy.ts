import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname
  const isPortal = pathname.startsWith('/portal')
  const isAdmin = pathname.startsWith('/admin')

  // Always refresh session cookie if there is a session
  const { data: { user } } = await supabase.auth.getUser()

  if (!isPortal && !isAdmin) {
    return supabaseResponse
  }

  // --- Public auth routes that don't require login ---
  const isPortalAuthRoute = pathname.startsWith('/portal/login') || 
                            pathname.startsWith('/portal/forgot-password') || 
                            pathname.startsWith('/portal/reset-password')
  const isAdminAuthRoute = pathname.startsWith('/admin/login')
  const isAuthRoute = isPortalAuthRoute || isAdminAuthRoute

  // --- Not logged in ---
  if (!user && !isAuthRoute) {
    // Redirect to the correct login page based on which area they're trying to access
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }

  // --- Already logged in, trying to visit a login page ---
  // The reset-password page must stay reachable for a logged-in recovery session.
  const isResetRoute = pathname.startsWith('/portal/reset-password')
  if (user && isPortalAuthRoute && !isResetRoute) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }
  if (user && isAdminAuthRoute) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // --- Force password change logic ---
  const forcePasswordChange = user?.user_metadata?.force_password_change === true
  const isChangePasswordRoute = pathname.startsWith('/portal/change-password')

  if (user && forcePasswordChange && !isChangePasswordRoute && isPortal) {
    return NextResponse.redirect(new URL('/portal/change-password', request.url))
  }

  if (user && !forcePasswordChange && isChangePasswordRoute) {
    return NextResponse.redirect(new URL('/portal', request.url))
  }

  // --- Admin role check ---
  if (isAdmin && user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
  }

  // --- Portal: if admin user visits /portal, redirect to /admin ---
  if (isPortal && user && !isAuthRoute && !isChangePasswordRoute) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webm|webp|mp4)$).*)',
  ],
}
