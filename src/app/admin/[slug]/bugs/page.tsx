import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BugsManager from '@/components/portal/BugsManager'

export default async function AdminBugsPage(
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

  const { data: bugs, error } = await supabase
    .from('bugs')
    .select(`
      *,
      reporter:profiles(full_name)
    `)
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  if (error && error.code !== '42P01') {
    console.error('Error fetching bugs:', error)
  }

  return <BugsManager bugs={bugs || []} projectId={project.id} isAdmin={true} />
}
