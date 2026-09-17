/** Route segments under /admin and /portal that are pages, not project slugs. */
export const RESERVED_SEGMENTS = new Set([
  'new',
  'login',
  'settings',
  'change-password',
  'forgot-password',
  'reset-password',
])

/**
 * Extracts the project slug from a pathname like `/portal/my-project/messages`.
 * Returns an empty string for dashboard-level pages (`/admin`, `/admin/new`, ...).
 */
export function getProjectSlugFromPath(pathname: string, mode: 'admin' | 'client') {
  const root = mode === 'admin' ? 'admin' : 'portal'
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length < 2 || segments[0] !== root) return ''
  const candidate = segments[1]
  if (RESERVED_SEGMENTS.has(candidate)) return ''
  return candidate
}
