import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ChatInterface from '@/components/portal/ChatInterface'

export default async function AdminMessagesPage(
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

  const { data: messages } = await supabase
    .from('messages')
    .select(`*, sender:profiles(full_name, avatar_url, role)`)
    .eq('project_id', project.id)
    .order('created_at', { ascending: true })

  return <ChatInterface initialMessages={messages || []} projectId={project.id} />
}
