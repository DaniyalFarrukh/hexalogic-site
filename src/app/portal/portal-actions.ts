'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Records that a client opened the portal (at most once per hour per user).
 * Uses the service role because clients cannot update `last_seen_at` themselves.
 */
export async function logClientActivity() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_seen_at, role')
    .eq('id', user.id)
    .single()

  if (error) return { success: false, error: error.message }
  if (profile.role === 'admin') return { success: true, skipped: true }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  if (profile.last_seen_at && new Date(profile.last_seen_at) > oneHourAgo) {
    return { success: true, skipped: true }
  }

  const adminClient = createAdminClient()

  await adminClient
    .from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', user.id)

  await adminClient
    .from('activity_log')
    .insert({
      project_id: null,
      actor_id: user.id,
      event_type: 'client_logged_in'
    })

  return { success: true, skipped: false }
}

export async function fetchMoreUpdates(projectId: string, cursorCreatedAt: string) {
  const supabase = await createClient()

  const { data: updates, error } = await supabase
    .from('updates')
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      media(*),
      comments(
        id, body, created_at, deleted_at,
        author:profiles(full_name, avatar_url, role),
        media(id, path, kind)
      )
    `)
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .lt('created_at', cursorCreatedAt)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching more updates:', error)
    return []
  }

  return updates || []
}
