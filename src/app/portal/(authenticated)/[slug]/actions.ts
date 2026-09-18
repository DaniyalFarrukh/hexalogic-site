'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email/resend'
import { NewCommentEmail } from '@/lib/email/templates/new-comment'
import { ApprovalEmail } from '@/lib/email/templates/approval'
import { SITE_URL } from '@/lib/site'

const MAX_COMMENT_ATTACHMENT_BYTES = 5 * 1024 * 1024

async function getAdminEmails() {
  const adminClient = createAdminClient()
  const { data: admins } = await adminClient.from('profiles').select('id').eq('role', 'admin')
  if (!admins || admins.length === 0) return []

  const emails: string[] = []
  for (const admin of admins) {
    const { data } = await adminClient.auth.admin.getUserById(admin.id)
    if (data?.user?.email) emails.push(data.user.email)
  }
  return emails
}

export async function postComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const projectId = String(formData.get('projectId') || '')
  const targetType = String(formData.get('targetType') || '') as 'update' | 'milestone'
  const targetId = String(formData.get('targetId') || '')
  const body = String(formData.get('body') || '').trim()
  const fileEntry = formData.get('file')
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null

  if (!projectId || !targetId || (targetType !== 'update' && targetType !== 'milestone')) {
    return { error: 'Invalid comment target' }
  }
  if (!body && !file) return { error: 'Comment cannot be empty' }
  if (body.length > 5000) return { error: 'Comment is too long (5000 characters max)' }
  if (file) {
    if (!file.type.startsWith('image/')) return { error: 'Only image attachments are supported' }
    if (file.size > MAX_COMMENT_ATTACHMENT_BYTES) return { error: 'Image must be under 5MB' }
  }

  const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
  const { data: project } = await supabase.from('projects').select('title, slug').eq('id', projectId).single()
  if (!project) return { error: 'Project not found' }

  const { data: comment, error: commentError } = await supabase
    .from('comments')
    .insert({
      project_id: projectId,
      author_id: user.id,
      body,
      ...(targetType === 'update' ? { update_id: targetId } : { milestone_id: targetId })
    })
    .select('id')
    .single()

  if (commentError) return { error: commentError.message }

  if (file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_').slice(0, 120)
    const filePath = `${projectId}/${crypto.randomUUID()}-${safeName}`
    const buffer = await file.arrayBuffer()

    const { error: uploadError } = await supabase.storage
      .from('project-media')
      .upload(filePath, buffer, { contentType: file.type })

    if (uploadError) return { error: `Comment posted, but the image could not be uploaded: ${uploadError.message}` }

    const { error: mediaError } = await supabase.from('media').insert({
      comment_id: comment.id,
      path: filePath,
      kind: 'image',
      mime_type: file.type,
      size_bytes: file.size,
      caption: file.name
    })
    if (mediaError) return { error: mediaError.message }
  }

  // Record activity so dashboards and notifications pick it up
  const adminClient = createAdminClient()
  await adminClient.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: 'comment_added',
    payload: { comment_id: comment.id, target_type: targetType, target_id: targetId }
  })

  // Notify admins when a client comments
  if (profile?.role !== 'admin') {
    const adminEmails = await getAdminEmails()
    if (adminEmails.length > 0) {
      const adminLink = `${SITE_URL}/admin/${project.slug}/${targetType === 'update' ? 'updates' : 'milestones'}`
      await Promise.allSettled(adminEmails.map(email =>
        sendEmail({
          to: email,
          subject: `New Comment from ${profile?.full_name || 'Client'} - ${project.title}`,
          template: NewCommentEmail({
            clientName: profile?.full_name || 'Client',
            projectName: project.title,
            commentBody: body || 'Uploaded an image.',
            adminLink
          })
        })
      ))
    }
  }

  revalidatePath(`/portal/${project.slug}`, 'layout')
  revalidatePath(`/admin/${project.slug}`, 'layout')
  return { success: true }
}

export async function deleteComment(commentId: string, slug: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('delete_own_comment', { p_comment_id: commentId })
  if (error) return { error: error.message }

  revalidatePath(`/portal/${slug}`, 'layout')
  revalidatePath(`/admin/${slug}`, 'layout')
  return { success: true }
}

export async function approveMilestoneAction(milestoneId: string, decision: 'approved' | 'changes_requested', note?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.rpc('approve_milestone', {
    p_milestone_id: milestoneId,
    p_decision: decision
  })
  if (error) return { error: error.message }

  const { data: milestone } = await supabase.from('milestones').select('title, project_id').eq('id', milestoneId).single()
  if (!milestone) return { success: true }

  const cleanNote = note?.trim()
  if (cleanNote) {
    await supabase.from('comments').insert({
      project_id: milestone.project_id,
      milestone_id: milestoneId,
      author_id: user.id,
      body: cleanNote
    })
  }

  const { data: project } = await supabase.from('projects').select('title, slug').eq('id', milestone.project_id).single()
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()

  if (project) {
    const adminEmails = await getAdminEmails()
    if (adminEmails.length > 0) {
      const adminLink = `${SITE_URL}/admin/${project.slug}/milestones`
      await Promise.allSettled(adminEmails.map(email =>
        sendEmail({
          to: email,
          subject: `Milestone ${decision === 'approved' ? 'Approved' : 'Changes Requested'} - ${project.title}`,
          template: ApprovalEmail({
            clientName: profile?.full_name || 'Client',
            projectName: project.title,
            milestoneName: milestone.title,
            isApproved: decision === 'approved',
            note: cleanNote,
            adminLink
          })
        })
      ))
    }
    revalidatePath(`/portal/${project.slug}`, 'layout')
    revalidatePath(`/admin/${project.slug}`, 'layout')
  }

  return { success: true }
}

export async function submitRating(projectId: string, stars: number, feedback: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return { error: 'Please choose a rating between 1 and 5 stars' }

  const { error } = await supabase.from('ratings').insert({
    project_id: projectId,
    author_id: user.id,
    stars,
    feedback: feedback.trim().slice(0, 2000)
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already submitted a rating for this project.' }
    }
    return { error: error.message }
  }

  const { data: project } = await supabase.from('projects').select('slug').eq('id', projectId).single()
  if (project) {
    revalidatePath(`/portal/${project.slug}`, 'layout')
    revalidatePath(`/admin/${project.slug}`, 'layout')
  }

  return { success: true }
}

export async function postMessage(projectId: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const clean = body.trim()
  if (!clean) return { error: 'Message cannot be empty' }
  if (clean.length > 4000) return { error: 'Message is too long (4000 characters max)' }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({ project_id: projectId, sender_id: user.id, body: clean })
    .select('id')
    .single()

  if (error) return { error: error.message }

  const adminClient = createAdminClient()
  await adminClient.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: 'message_sent',
    payload: { message_id: message.id }
  })

  return { success: true, messageId: message.id }
}
