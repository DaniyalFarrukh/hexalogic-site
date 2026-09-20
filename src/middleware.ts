import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Intercept Supabase Auth redirects that fell back to the Site URL.
  // This happens when the `redirectTo` URL is not in Supabase's allowed Redirect URLs.
  // Supabase defaults to sending the user to the Site URL (typically '/') with the `code` param.
  if (pathname === '/' && searchParams.has('code')) {
    const code = searchParams.get('code')
    const confirmUrl = new URL('/auth/confirm', request.url)
    confirmUrl.searchParams.set('code', code!)
    
    // Default to redirecting to the reset-password page since this is the most common use case
    // for this fallback, but it could be adjusted if other auth flows are added.
    confirmUrl.searchParams.set('next', '/portal/reset-password')
    
    return NextResponse.redirect(confirmUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
