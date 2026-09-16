import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProjectTimeline from '@/components/ProjectTimeline'

export default async function DetailsPage(
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
    .select(`*`)
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  return (
    <div className="space-y-6">
      <ProjectTimeline milestones={milestones || []} mode="client" />
    </div>
  )
}
