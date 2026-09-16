import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectActivityLog from '@/components/admin/ProjectActivityLog'

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
      .select(`
        id, body, created_at,
        author:profiles(full_name, role)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('activity_log')
      .select(`
        id, event_type, created_at, payload,
        actor:profiles(full_name, role)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(50)
  ])

  const activityItems: any[] = []
  if (rawComments) {
    rawComments.forEach((c: any) => {
      activityItems.push({
        id: c.id,
        type: 'comment',
        created_at: c.created_at,
        actorName: c.author?.full_name || 'Unknown User',
        actorRole: c.author?.role,
        body: c.body
      })
    })
  }
  if (rawActivityLogs) {
    rawActivityLogs.forEach((a: any) => {
      activityItems.push({
        id: a.id,
        type: a.event_type,
        created_at: a.created_at,
        actorName: a.actor?.full_name || 'Unknown User',
        actorRole: a.actor?.role
      })
    })
  }
  
  activityItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const recentActivities = activityItems.slice(0, 50)

  return <ProjectActivityLog projectId={project.id} initialActivities={recentActivities} />
}
