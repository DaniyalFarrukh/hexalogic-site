'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addBug(projectId: string, data: { title: string, description: string, severity: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('bugs').insert({
    project_id: projectId,
    reporter_id: user.id,
    title: data.title,
    description: data.description,
    severity: data.severity,
    status: 'open'
  })

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/bugs`, 'page')
  revalidatePath(`/admin/[slug]/bugs`, 'page')
  return { success: true }
}

export async function updateBugStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('bugs').update({
    status
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/bugs`, 'page')
  revalidatePath(`/admin/[slug]/bugs`, 'page')
  return { success: true }
}

export async function updateBugSeverity(id: string, severity: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('bugs').update({
    severity
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/bugs`, 'page')
  revalidatePath(`/admin/[slug]/bugs`, 'page')
  return { success: true }
}

export async function deleteBug(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('bugs').delete().eq('id', id)

  if (error) return { error: error.message }
  revalidatePath(`/portal/[slug]/bugs`, 'page')
  revalidatePath(`/admin/[slug]/bugs`, 'page')
  return { success: true }
}
