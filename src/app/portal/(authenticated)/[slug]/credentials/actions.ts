'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CredentialInput = {
  title: string
  url?: string
  username: string
  password: string
  notes?: string
}

function sanitize(data: CredentialInput) {
  const title = (data.title || '').trim().slice(0, 120)
  const username = (data.username || '').trim().slice(0, 255)
  const password = (data.password || '').slice(0, 512)
  const url = (data.url || '').trim().slice(0, 500)
  const notes = (data.notes || '').trim().slice(0, 2000)

  if (!title) return { error: 'Please give this credential a title' }
  if (!username) return { error: 'Username or email is required' }
  if (!password) return { error: 'Password is required' }

  return { value: { title, url: url || null, username, password, notes: notes || null } }
}

async function revalidateCredentialPages(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string) {
  const { data: project } = await supabase.from('projects').select('slug').eq('id', projectId).single()
  if (project?.slug) {
    revalidatePath(`/portal/${project.slug}/credentials`)
    revalidatePath(`/admin/${project.slug}/credentials`)
  }
}

export async function addCredential(projectId: string, data: CredentialInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = sanitize(data)
  if ('error' in parsed) return { error: parsed.error }

  const { error } = await supabase.from('credentials').insert({ project_id: projectId, ...parsed.value })
  if (error) return { error: error.message }

  await revalidateCredentialPages(supabase, projectId)
  return { success: true }
}

export async function updateCredential(id: string, data: CredentialInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = sanitize(data)
  if ('error' in parsed) return { error: parsed.error }

  const { data: row, error } = await supabase.from('credentials').update(parsed.value).eq('id', id).select('project_id').single()
  if (error) return { error: error.message }

  await revalidateCredentialPages(supabase, row.project_id)
  return { success: true }
}

export async function deleteCredential(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: row, error } = await supabase.from('credentials').delete().eq('id', id).select('project_id').single()
  if (error) return { error: error.message }

  await revalidateCredentialPages(supabase, row.project_id)
  return { success: true }
}
