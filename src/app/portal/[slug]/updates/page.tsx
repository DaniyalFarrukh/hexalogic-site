import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import UpdatesFeed from '@/components/portal/UpdatesFeed'

export default async function UpdatesPage(
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

  const { data: updates } = await supabase
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
    .eq('project_id', project.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(10)

  return <UpdatesFeed initialUpdates={updates || []} projectId={project.id} />
}
