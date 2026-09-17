import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MilestonesList from '@/components/portal/MilestonesList'

export default async function MilestonesPage(
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

  return <MilestonesList milestones={milestones || []} />
}
