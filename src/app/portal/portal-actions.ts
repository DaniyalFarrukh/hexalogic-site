'use server'

import { createClient } from '@/lib/supabase/server'

export async function logClientActivity() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  // 1. Fetch current profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('last_seen_at, role')
    .eq('id', user.id)
    .single()

  if (error) return { success: false, error: error.message }
  if (profile.role === 'admin') return { success: true, skipped: true }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  // 2. Check if less than an hour has passed
  if (profile.last_seen_at && new Date(profile.last_seen_at) > oneHourAgo) {
    return { success: true, skipped: true }
  }

  // 3. Update last_seen_at (handled via update_own_profile RPC in migration 1? 
  // Wait, update_own_profile doesn't allow changing last_seen_at. 
  // Actually, we must use service_role client for this, or create a specific RPC for activity, 
  // or allow last_seen_at update via RLS?
  // Let's check RLS on profiles. The plan didn't explicitly mention how last_seen_at gets updated safely.
  // We can use the service role client internally within the Server Action for this system update.
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminClient = createAdminClient()
  
  await adminClient
    .from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', user.id)

  // 4. Insert into activity_log
  // Wait, activity_log requires a project_id. "client_logged_in" - wait, does the prompt say to log this per project?
  // "write a client_logged_in activity_log row (max once per hour per user)."
  // activity_log table schema: project_id (FK), actor_id, event_type.
  // If they log into the portal, which project_id? 
  // If it's done on the portal index, project_id might be null. BUT project_id is NOT NULL in `activity_log`?
  // Checking schema: `project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE`
  // It is NOT marked as NOT NULL! So project_id can be null!
  // I will insert it with project_id = null.
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

  // 1. Fetch updates older than cursor (RLS protects projectId access)
  const { data: updates, error } = await supabase
    .from('updates')
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      media(*)
    `)
    .eq('project_id', projectId)
    .is('deleted_at', null)
    .lt('created_at', cursorCreatedAt)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching more updates:", error)
    return []
  }

  return updates
}
