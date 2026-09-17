import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CredentialsManager from '@/components/portal/CredentialsManager'

export default async function PortalCredentialsPage(
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

  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  if (error && error.code !== '42P01') {
    console.error('Error fetching credentials:', error)
  }

  // Clients can add credentials, but they are not admins
  return <CredentialsManager credentials={credentials || []} projectId={project.id} isAdmin={false} />
}
