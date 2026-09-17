'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmail } from '@/lib/email/templates/welcome'
import { NewUpdateEmail } from '@/lib/email/templates/new-update'
import { ProjectCompleteEmail } from '@/lib/email/templates/project-complete'
import { MilestoneDoneEmail } from '@/lib/email/templates/milestone-done'
import { SITE_URL } from '@/lib/site'

const adminClient = createAdminClient()

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const RESERVED_SLUGS = new Set(['new', 'login', 'change-password', 'settings', 'forgot-password', 'reset-password'])

export type MilestoneInput = {
  id?: string
  title: string
  description?: string | null
  status: 'pending' | 'in_progress' | 'done'
  position: number
  due_date?: string | null
}

export type ProjectDetailsInput = {
  title?: string
  description?: string | null
  status?: 'planning' | 'in_progress' | 'review' | 'on_hold' | 'completed' | 'archived'
  progress?: number
  start_date?: string | null
  due_date?: string | null
}

export type MediaInput = {
  path: string
  kind: 'image' | 'video' | 'file'
  size_bytes: number
  mime_type: string
  caption: string | null
}

type MemberRow = { profile_id: string; profiles: { email_prefs: { every_update?: boolean } | null } | null }

function errorMessage(error: unknown, fallback = 'An unexpected error occurred') {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message
  }
  return fallback
}

function friendlyDbError(error: { code?: string; message: string }) {
  if (error.code === '23505') return 'That slug is already in use. Please choose a different one.'
  return error.message
}

/** Verifies the caller is a signed-in admin. */
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, error: 'Unauthorized' as const }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { supabase, user: null, error: 'Forbidden' as const }

  return { supabase, user, error: null }
}

/** Looks a user up by email, paging through the auth user list. */
async function findAuthUserByEmail(email: string) {
  const target = email.toLowerCase()
  const perPage = 1000
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage })
    if (error) throw error
    const match = data.users.find(u => u.email?.toLowerCase() === target)
    if (match) return match
    if (data.users.length < perPage) break
  }
  return null
}

/** Resolves the notification emails of project members who opted into instant updates. */
async function getSubscribedMemberEmails(projectId: string) {
  const { data: members } = await adminClient
    .from('project_members')
    .select('profile_id, profiles!inner ( email_prefs )')
    .eq('project_id', projectId)

  const rows = (members || []) as unknown as MemberRow[]
  const subscribed = rows.filter(m => m.profiles?.email_prefs?.every_update === true)

  const emails: string[] = []
  for (const member of subscribed) {
    const { data } = await adminClient.auth.admin.getUserById(member.profile_id)
    if (data?.user?.email) emails.push(data.user.email)
  }
  return emails
}

/** Creates a long-lived signed URL for private media so it can be embedded in an email. */
async function signedMediaUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const { data } = await adminClient.storage.from('project-media').createSignedUrl(path, 60 * 60 * 24 * 7)
  return data?.signedUrl
}

export async function createClientAndProject(formData: FormData) {
  const auth = await requireAdmin()
  if (auth.error || !auth.user) return { error: auth.error || 'Unauthorized' }
  const { user } = auth

  const email = String(formData.get('email') || '').trim()
  const fullName = String(formData.get('full_name') || '').trim()
  const company = String(formData.get('company') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const description = String(formData.get('description') || '').trim()
  const slug = String(formData.get('slug') || '').trim().toLowerCase()
  const startDate = String(formData.get('start_date') || '')
  const dueDate = String(formData.get('due_date') || '')

  if (!email || !fullName || !title || !slug) {
    return { error: 'Missing required fields' }
  }
  if (!SLUG_PATTERN.test(slug) || slug.length > 80) {
    return { error: 'Slug may only contain lowercase letters, numbers and single hyphens.' }
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { error: 'That slug is reserved. Please choose a different one.' }
  }

  try {
    const { data: existingProject } = await adminClient.from('projects').select('id').eq('slug', slug).maybeSingle()
    if (existingProject) {
      return { error: 'That slug is already in use. Please choose a different one.' }
    }

    // 1. Find or create the client account
    const existingUser = await findAuthUserByEmail(email)
    let clientId = existingUser?.id
    const isNewUser = !existingUser
    let tempPassword = ''

    if (isNewUser) {
      tempPassword = crypto.randomBytes(16).toString('base64url')
      const { data: newAuth, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { force_password_change: true }
      })

      if (createError) throw createError
      if (!newAuth.user) throw new Error('User creation failed without throwing an error')

      clientId = newAuth.user.id

      const { error: profileError } = await adminClient.from('profiles').insert({
        id: clientId,
        full_name: fullName,
        company,
        role: 'client'
      })
      if (profileError) throw profileError
    }

    if (!clientId) throw new Error('Failed to determine client ID')

    // 2. Create the project
    const { data: project, error: projectError } = await adminClient.from('projects').insert({
      title,
      slug,
      description: description || null,
      start_date: startDate || null,
      due_date: dueDate || null
    }).select('id').single()

    if (projectError) throw new Error(friendlyDbError(projectError))

    // 3. Add the client as owner and the admin as a viewer
    const { error: memberError } = await adminClient.from('project_members').insert({
      project_id: project.id,
      profile_id: clientId,
      role: 'owner'
    })
    if (memberError) throw memberError

    await adminClient.from('project_members').insert({
      project_id: project.id,
      profile_id: user.id,
      role: 'viewer'
    })

    // 4. Seed default milestones
    const milestones = [
      { title: 'Discovery', description: 'Requirements and initial planning', position: 1 },
      { title: 'Design', description: 'UI/UX design phase', position: 2 },
      { title: 'Development', description: 'Core implementation', position: 3 },
      { title: 'Testing', description: 'QA and user acceptance testing', position: 4 },
      { title: 'Launch', description: 'Final deployment', position: 5 }
    ].map(m => ({ project_id: project.id, ...m }))

    const { error: msError } = await adminClient.from('milestones').insert(milestones)
    if (msError) throw msError

    await adminClient.from('activity_log').insert({
      project_id: project.id,
      actor_id: user.id,
      event_type: 'project_created'
    })

    // 5. Welcome email for new users (errors are logged, not surfaced)
    if (isNewUser) {
      const result = await sendEmail({
        to: email,
        subject: 'Welcome to the HexaLogic Portal',
        template: WelcomeEmail({ email, tempPassword })
      })
      if (!result.success) console.error('Welcome email failed:', result.error)
    }

    revalidatePath('/admin')

    return {
      success: true,
      isNewUser,
      credentials: isNewUser ? { email, tempPassword } : undefined,
      slug
    }
  } catch (error) {
    console.error('Error creating client/project:', error)
    return { error: errorMessage(error) }
  }
}

export async function softDeleteUpdate(updateId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }

  const { data: update } = await auth.supabase.from('updates').select('project_id').eq('id', updateId).single()

  const { error } = await auth.supabase
    .from('updates')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', updateId)

  if (error) return { error: error.message }

  if (update?.project_id) {
    const { data: project } = await auth.supabase.from('projects').select('slug').eq('id', update.project_id).single()
    if (project?.slug) {
      revalidatePath(`/admin/${project.slug}/updates`)
      revalidatePath(`/portal/${project.slug}/updates`)
    }
  }
  return { success: true }
}

export async function updateProjectDetails(projectId: string, data: ProjectDetailsInput) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  const { supabase } = auth

  const payload: ProjectDetailsInput = {}
  if (typeof data.title === 'string') {
    const title = data.title.trim()
    if (!title) return { error: 'Title cannot be empty' }
    payload.title = title
  }
  if (data.description !== undefined) payload.description = data.description?.trim() || null
  if (data.status !== undefined) payload.status = data.status
  if (data.progress !== undefined) {
    const progress = Number(data.progress)
    if (!Number.isFinite(progress) || progress < 0 || progress > 100) return { error: 'Progress must be between 0 and 100' }
    payload.progress = Math.round(progress)
  }
  if (data.start_date !== undefined) payload.start_date = data.start_date || null
  if (data.due_date !== undefined) payload.due_date = data.due_date || null

  const { data: oldProject } = await supabase
    .from('projects')
    .select('status, title, start_date, hours_logged, slug')
    .eq('id', projectId)
    .single()

  if (!oldProject) return { error: 'Project not found' }

  const { error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', projectId)

  if (error) return { error: friendlyDbError(error) }

  const isCompleting = payload.status === 'completed' && oldProject.status !== 'completed'
  if (isCompleting) {
    try {
      const emails = await getSubscribedMemberEmails(projectId)
      const updateLink = `${SITE_URL}/portal/${oldProject.slug}`
      await Promise.allSettled(emails.map(email =>
        sendEmail({
          to: email,
          subject: `Project Completed: ${payload.title || oldProject.title}`,
          template: ProjectCompleteEmail({
            projectName: payload.title || oldProject.title,
            totalHours: oldProject.hours_logged || 0,
            startDate: oldProject.start_date || 'N/A',
            endDate: new Date().toISOString().split('T')[0],
            updateLink
          })
        })
      ))
    } catch (emailError) {
      console.error('Failed to send project complete emails:', emailError)
    }
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/${oldProject.slug}`, 'layout')
  revalidatePath(`/portal/${oldProject.slug}`, 'layout')
  return { success: true }
}

export async function removeClientAccess(projectId: string, profileId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }

  const { error } = await auth.supabase
    .from('project_members')
    .delete()
    .match({ project_id: projectId, profile_id: profileId })

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Saves the milestone list for a project.
 *
 * Existing milestones are updated in place (keeping their comments and approval
 * history), new ones are inserted, and only milestones the admin removed are
 * deleted.
 */
export async function updateMilestones(projectId: string, milestones: MilestoneInput[]) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  const { supabase } = auth

  const { data: project } = await supabase.from('projects').select('id, title, slug').eq('id', projectId).single()
  if (!project) return { error: 'Project not found' }

  for (const m of milestones) {
    if (!m.title || !m.title.trim()) return { error: 'Every milestone needs a title' }
  }

  const { data: existing } = await supabase.from('milestones').select('id, status').eq('project_id', projectId)
  const existingById = new Map((existing || []).map(m => [m.id, m]))
  const submittedIds = new Set(milestones.filter(m => m.id).map(m => m.id as string))

  // 1. Delete milestones the admin removed
  const toDelete = (existing || []).filter(m => !submittedIds.has(m.id)).map(m => m.id)
  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase.from('milestones').delete().in('id', toDelete)
    if (deleteError) return { error: deleteError.message }
  }

  // 2. Update existing milestones
  const newlyDone: { title: string }[] = []
  for (const m of milestones) {
    const base = {
      title: m.title.trim(),
      description: m.description?.trim() || null,
      status: m.status,
      position: m.position,
      due_date: m.due_date || null,
    }

    if (m.id && existingById.has(m.id)) {
      const { error: updateError } = await supabase.from('milestones').update(base).eq('id', m.id)
      if (updateError) return { error: updateError.message }
      if (m.status === 'done' && existingById.get(m.id)?.status !== 'done') newlyDone.push({ title: base.title })
    } else {
      const { error: insertError } = await supabase.from('milestones').insert({ ...base, project_id: projectId })
      if (insertError) return { error: insertError.message }
      if (m.status === 'done') newlyDone.push({ title: base.title })
    }
  }

  // 3. Notify subscribed members about newly completed milestones
  if (newlyDone.length > 0) {
    try {
      const emails = await getSubscribedMemberEmails(projectId)
      const updateLink = `${SITE_URL}/portal/${project.slug}/milestones`
      const jobs = emails.flatMap(email => newlyDone.map(md =>
        sendEmail({
          to: email,
          subject: `Milestone Completed: ${md.title}`,
          template: MilestoneDoneEmail({
            projectName: project.title,
            milestoneName: md.title,
            nextSteps: 'Please review the deliverables and approve this milestone or request changes in the portal.',
            updateLink
          })
        })
      ))
      await Promise.allSettled(jobs)
    } catch (emailError) {
      console.error('Failed to send milestone emails:', emailError)
    }
  }

  // 4. Return the fresh list, including comments, so the UI stays in sync
  const { data } = await supabase
    .from('milestones')
    .select(`
      *,
      comments(
        id, body, created_at, deleted_at,
        author:profiles(full_name, avatar_url, role),
        media(id, path, kind)
      )
    `)
    .eq('project_id', projectId)
    .order('position', { ascending: true })

  revalidatePath(`/admin/${project.slug}`, 'layout')
  revalidatePath(`/portal/${project.slug}`, 'layout')
  return { success: true, data: data || [] }
}

export async function generateUploadUrl(slug: string, fileName: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }

  const { data: project } = await auth.supabase.from('projects').select('id').eq('slug', slug).single()
  if (!project) return { error: 'Project not found' }

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_').slice(0, 120)
  const path = `${project.id}/${crypto.randomUUID()}-${sanitizedFileName}`

  const { data, error } = await auth.supabase.storage.from('project-media').createSignedUploadUrl(path)

  if (error) return { error: error.message }
  return { success: true, signedUrl: data.signedUrl, path: data.path }
}

/** Guesses the media kind of an external link so the gallery can render it sensibly. */
export async function classifyExternalUrl(url: string): Promise<MediaInput['kind']> {
  const lower = url.toLowerCase()
  if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/.test(lower)) return 'image'
  if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(lower) || /youtube\.com|youtu\.be|vimeo\.com|loom\.com/.test(lower)) return 'video'
  return 'file'
}

export async function publishProjectUpdate(
  slug: string,
  title: string,
  body: string,
  hours: number,
  mediaArray: MediaInput[]
) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }
  const { supabase } = auth

  const cleanTitle = title.trim()
  const cleanBody = body.trim()
  if (!cleanTitle || !cleanBody) return { error: 'Title and details are required' }
  const safeHours = Number.isFinite(hours) && hours >= 0 ? hours : 0

  const { data: project } = await supabase.from('projects').select('id, title, progress').eq('slug', slug).single()
  if (!project) return { error: 'Project not found' }

  const { error } = await supabase.rpc('publish_project_update', {
    p_project_id: project.id,
    p_title: cleanTitle,
    p_body: cleanBody,
    p_hours: safeHours,
    p_progress: project.progress,
    p_media: mediaArray
  })

  if (error) return { error: error.message }

  try {
    const emails = await getSubscribedMemberEmails(project.id)
    if (emails.length > 0) {
      const updateLink = `${SITE_URL}/portal/${slug}/updates`
      const firstImage = mediaArray.find(m => m.kind === 'image')
      const thumbnailUrl = firstImage ? await signedMediaUrl(firstImage.path) : undefined

      await Promise.allSettled(emails.map(email =>
        sendEmail({
          to: email,
          subject: `New Update: ${cleanTitle} - ${project.title}`,
          template: NewUpdateEmail({
            projectName: project.title,
            updateTitle: cleanTitle,
            updateBody: cleanBody.substring(0, 150) + (cleanBody.length > 150 ? '...' : ''),
            progressPercent: project.progress || 0,
            thumbnailUrl,
            updateLink
          })
        })
      ))
    }
  } catch (emailError) {
    console.error('Failed to send update emails:', emailError)
  }

  revalidatePath(`/admin/${slug}`, 'layout')
  revalidatePath(`/portal/${slug}`, 'layout')
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const auth = await requireAdmin()
  if (auth.error) return { error: auth.error }

  const { error } = await adminClient
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return { success: true }
}
