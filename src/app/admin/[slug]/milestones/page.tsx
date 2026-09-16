import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AdminProjectControls from '@/components/admin/AdminProjectControls'
import MilestonesManager from '@/components/admin/MilestonesManager'

export default async function AdminMilestonesPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        role,
        profiles(id, full_name, company, avatar_url)
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

  const clientMember = project.project_members?.find((m: any) => m.role === 'owner') || project.project_members?.[0]

  return (
    <div className="space-y-6">
      <AdminProjectControls project={project} profileId={clientMember?.profiles?.id} />
      <MilestonesManager initialMilestones={milestones || []} projectId={project.id} />
    </div>
  )
}
