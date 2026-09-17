import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CredentialsManager from '@/components/portal/CredentialsManager'

export default async function AdminCredentialsPage(
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

  // Wait, let's catch postgrest errors in case the table doesn't exist yet
  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })

  if (error && error.code !== '42P01') {
    // 42P01 is relation does not exist, which can happen before migration
    console.error('Error fetching credentials:', error)
  }

  return <CredentialsManager credentials={credentials || []} projectId={project.id} isAdmin={true} />
}
