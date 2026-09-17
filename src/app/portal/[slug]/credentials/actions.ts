'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addCredential(projectId: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('credentials').insert({
    project_id: projectId,
    title: data.title,
    url: data.url,
    username: data.username,
    password: data.password,
    notes: data.notes
  })

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/credentials`, 'page')
  revalidatePath(`/admin/[slug]/credentials`, 'page')
  return { success: true }
}

export async function updateCredential(id: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('credentials').update({
    title: data.title,
    url: data.url,
    username: data.username,
    password: data.password,
    notes: data.notes
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/credentials`, 'page')
  revalidatePath(`/admin/[slug]/credentials`, 'page')
  return { success: true }
}

export async function deleteCredential(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('credentials').delete().eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/credentials`, 'page')
  revalidatePath(`/admin/[slug]/credentials`, 'page')
  return { success: true }
}
