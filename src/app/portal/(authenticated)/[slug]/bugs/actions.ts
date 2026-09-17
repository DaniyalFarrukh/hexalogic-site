'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical'
export type BugStatus = 'open' | 'in_progress' | 'resolved'

const SEVERITIES: BugSeverity[] = ['low', 'medium', 'high', 'critical']
const STATUSES: BugStatus[] = ['open', 'in_progress', 'resolved']

async function revalidateBugPages(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string) {
  const { data: project } = await supabase.from('projects').select('slug').eq('id', projectId).single()
  if (project?.slug) {
    revalidatePath(`/portal/${project.slug}/bugs`)
    revalidatePath(`/admin/${project.slug}/bugs`)
  }
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single()
  return profile?.role === 'admin'
}

export async function addBug(projectId: string, data: { title: string; description: string; severity: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const title = data.title?.trim()
  const description = data.description?.trim()
  const severity = SEVERITIES.includes(data.severity as BugSeverity) ? (data.severity as BugSeverity) : 'medium'
  if (!title) return { error: 'Please add a short title' }
  if (!description) return { error: 'Please describe the issue' }

  const { error } = await supabase.from('bugs').insert({
    project_id: projectId,
    reporter_id: user.id,
    title: title.slice(0, 200),
    description: description.slice(0, 5000),
    severity,
    status: 'open'
  })

  if (error) return { error: error.message }
  await revalidateBugPages(supabase, projectId)
  return { success: true }
}

export async function updateBugStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  if (!(await requireAdmin(supabase, user.id))) return { error: 'Only the HexaLogic team can change an issue status' }
  if (!STATUSES.includes(status as BugStatus)) return { error: 'Invalid status' }

  const { data: bug, error } = await supabase.from('bugs').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('project_id').single()
  if (error) return { error: error.message }
  await revalidateBugPages(supabase, bug.project_id)
  return { success: true }
}

export async function updateBugSeverity(id: string, severity: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  if (!(await requireAdmin(supabase, user.id))) return { error: 'Only the HexaLogic team can change an issue severity' }
  if (!SEVERITIES.includes(severity as BugSeverity)) return { error: 'Invalid severity' }

  const { data: bug, error } = await supabase.from('bugs').update({ severity, updated_at: new Date().toISOString() }).eq('id', id).select('project_id').single()
  if (error) return { error: error.message }
  await revalidateBugPages(supabase, bug.project_id)
  return { success: true }
}

export async function deleteBug(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }
  if (!(await requireAdmin(supabase, user.id))) return { error: 'Only the HexaLogic team can delete issues' }

  const { data: bug, error } = await supabase.from('bugs').delete().eq('id', id).select('project_id').single()
  if (error) return { error: error.message }
  await revalidateBugPages(supabase, bug.project_id)
  return { success: true }
}
