import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectActivityLog, { type ActivityItem } from '@/components/admin/ProjectActivityLog'

type CommentRow = {
  id: string
  body: string
  created_at: string
  author: { full_name: string | null; role: string | null } | null
}

type ActivityRow = {
  id: string
  event_type: string
  created_at: string
  payload: Record<string, unknown> | null
  actor: { full_name: string | null; role: string | null } | null
}

export default async function AdminActivityPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!project) notFound()

  const [
    { data: rawComments },
    { data: rawActivityLogs }
  ] = await Promise.all([
    supabase
      .from('comments')
      .select('id, body, created_at, author:profiles(full_name, role)')
      .eq('project_id', project.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('activity_log')
      .select('id, event_type, created_at, payload, actor:profiles(full_name, role)')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(50)
  ])

  const items: ActivityItem[] = []

  for (const c of (rawComments || []) as unknown as CommentRow[]) {
    items.push({
      id: `comment-${c.id}`,
      type: 'comment',
      created_at: c.created_at,
      actorName: c.author?.full_name || 'Unknown user',
      actorRole: c.author?.role || undefined,
      body: c.body,
    })
  }

  for (const a of (rawActivityLogs || []) as unknown as ActivityRow[]) {
    items.push({
      id: `activity-${a.id}`,
      type: a.event_type,
      created_at: a.created_at,
      actorName: a.actor?.full_name || 'System',
      actorRole: a.actor?.role || undefined,
      payload: a.payload,
    })
  }

  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <ProjectActivityLog projectId={project.id} initialActivities={items.slice(0, 50)} />
}
