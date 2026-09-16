'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email/resend'
import { NewCommentEmail } from '@/lib/email/templates/new-comment'
import { ApprovalEmail } from '@/lib/email/templates/approval'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getAdminEmails() {
  // Fetch profiles with role 'admin'
  const { data: admins } = await adminClient.from('profiles').select('id').eq('role', 'admin')
  if (!admins || admins.length === 0) return []
  
  // Resolve actual emails
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

  const projectId = formData.get('projectId') as string
  const targetType = formData.get('targetType') as 'update' | 'milestone'
  const targetId = formData.get('targetId') as string
  const body = formData.get('body') as string
  const file = formData.get('file') as File | null

  if (!body.trim() && !file) return { error: 'Comment cannot be empty' }

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
  const { data: project } = await supabase.from('projects').select('title, slug').eq('id', projectId).single()

  // Insert comment
  const commentPayload: any = {
    project_id: projectId,
    author_id: user.id,
    body,
    ...(targetType === 'update' ? { update_id: targetId } : { milestone_id: targetId })
  }

  const { data: comment, error: commentError } = await supabase
    .from('comments')
    .insert(commentPayload)
    .select('id')
    .single()

  if (commentError) return { error: commentError.message }

  // Handle file upload
  if (file) {
    const fileExt = file.name.split('.').pop()
    const filePath = `${projectId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    
    // We can't upload directly to storage via server action easily without array buffer, 
    // Wait, we can using arrayBuffer().
    const buffer = await file.arrayBuffer()
    const { error: uploadError } = await supabase.storage
      .from('project-media')
      .upload(filePath, buffer, {
        contentType: file.type,
      })
      
    if (uploadError) return { error: uploadError.message }

    const { error: mediaError } = await supabase.from('media').insert({
      comment_id: comment.id,
      path: filePath,
      kind: 'image', // Assuming screenshot
      mime_type: file.type,
      size_bytes: file.size,
      caption: file.name
    })

    if (mediaError) return { error: mediaError.message }
  }

  // Send email to admins
  if (project && profile) {
    const adminEmails = await getAdminEmails()
    const adminLink = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/${project.slug}`
    
    if (adminEmails.length > 0) {
      const emailPromises = adminEmails.map(email => 
        sendEmail({
          to: email,
          subject: `New Comment from ${profile.full_name} - ${project.title}`,
          template: NewCommentEmail({
            clientName: profile.full_name || 'Client',
            projectName: project.title,
            commentBody: body || 'Uploaded an image.',
            adminLink
          })
        })
      )
      await Promise.allSettled(emailPromises)
    }
  }

  if (project?.slug) revalidatePath(`/portal/${project.slug}`)
  return { success: true }
}

export async function deleteComment(commentId: string, slug: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('delete_own_comment', {
    p_comment_id: commentId
  })

  if (error) return { error: error.message }
  
  revalidatePath(`/portal/${slug}`)
  return { success: true }
}

export async function approveMilestoneAction(milestoneId: string, decision: 'approved' | 'changes_requested', note?: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('approve_milestone', {
    p_milestone_id: milestoneId,
    p_decision: decision
  })

  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()

  // If a note was provided, save it as a comment on the milestone
  if (note && note.trim() !== '' && user) {
    await supabase.from('comments').insert({
      project_id: (await supabase.from('milestones').select('project_id').eq('id', milestoneId).single()).data?.project_id,
      milestone_id: milestoneId,
      author_id: user.id,
      body: note
    })
  }

  // Send email
  const { data: milestone } = await supabase.from('milestones').select('title, project_id').eq('id', milestoneId).single()
  if (milestone) {
    const { data: project } = await supabase.from('projects').select('title, slug').eq('id', milestone.project_id).single()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user?.id).single()

    if (project && profile) {
      const adminEmails = await getAdminEmails()
      const adminLink = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/${project.slug}`
      
      if (adminEmails.length > 0) {
        const emailPromises = adminEmails.map(email => 
          sendEmail({
            to: email,
            subject: `Milestone ${decision === 'approved' ? 'Approved' : 'Changes Requested'} - ${project.title}`,
            template: ApprovalEmail({
              clientName: profile.full_name || 'Client',
              projectName: project.title,
              milestoneName: milestone.title,
              isApproved: decision === 'approved',
              note: note,
              adminLink
            })
          })
        )
        await Promise.allSettled(emailPromises)
      }
    }
    
    if (project?.slug) revalidatePath(`/portal/${project.slug}`)
  }

  return { success: true }
}

export async function submitRating(projectId: string, stars: number, feedback: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('ratings').insert({
    project_id: projectId,
    author_id: user.id,
    stars,
    feedback
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'You have already submitted a rating for this project.' }
    }
    return { error: error.message }
  }

  const { data: project } = await supabase.from('projects').select('slug').eq('id', projectId).single()
  if (project) {
    revalidatePath(`/portal/${project.slug}`)
    revalidatePath(`/admin/${project.slug}`)
  }

  return { success: true }
}

export async function postMessage(projectId: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  if (!body.trim()) return { error: 'Message cannot be empty' }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      project_id: projectId,
      sender_id: user.id,
      body: body
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Use admin client to bypass RLS for system logs like activity_log
  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminSupabase = createAdminClient()
  await adminSupabase.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: 'message_sent',
    payload: { message_id: message.id }
  })

  // We could send an email notification here, but skipping for V1 to keep it simple

  return { success: true, messageId: message.id }
}
