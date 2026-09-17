import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminProjectControls from '@/components/admin/AdminProjectControls'
import MilestonesManager from '@/components/admin/MilestonesManager'

type MemberRow = { role: string; profiles: { id: string; full_name: string | null; company: string | null } | null }

export default async function AdminMilestonesPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      id, title, slug, description, status, progress, start_date, due_date,
      project_members(
        role,
        profiles(id, full_name, company)
      )
    `)
    .eq('slug', params.slug)
    .single()

  if (!project) notFound()

  const { data: milestones } = await supabase
    .from('milestones')
    .select(`
      *,
      comments(
        id, body, created_at, deleted_at,
        author:profiles(full_name, avatar_url, role),
        media(id, path, kind)
      )
    `)
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  const members = (project.project_members || []) as unknown as MemberRow[]
  const clientMember = members.find(m => m.role === 'owner') || members[0]

  return (
    <div className="space-y-6">
      <AdminProjectControls
        project={{
          id: project.id,
          title: project.title,
          description: project.description,
          status: project.status,
          progress: project.progress,
          start_date: project.start_date,
          due_date: project.due_date,
        }}
        clientProfileId={clientMember?.profiles?.id}
        clientName={clientMember?.profiles?.full_name || clientMember?.profiles?.company || undefined}
      />
      <MilestonesManager
        key={project.id}
        initialMilestones={milestones || []}
        projectId={project.id}
      />
    </div>
  )
}
