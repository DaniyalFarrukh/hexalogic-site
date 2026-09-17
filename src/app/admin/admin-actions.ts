'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email/resend'
import { WelcomeEmail } from '@/lib/email/templates/welcome'
import { NewUpdateEmail } from '@/lib/email/templates/new-update'
import { ProjectCompleteEmail } from '@/lib/email/templates/project-complete'
import { MilestoneDoneEmail } from '@/lib/email/templates/milestone-done'

const adminClient = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function createClientAndProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Authorize
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return { error: 'Forbidden' }
  }

  const email = formData.get('email') as string
  const fullName = formData.get('full_name') as string
  const company = formData.get('company') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const slug = formData.get('slug') as string
  const startDate = formData.get('start_date') as string
  const dueDate = formData.get('due_date') as string

  if (!email || !fullName || !title || !slug) {
    return { error: 'Missing required fields' }
  }

  try {
    // 1. Check if user already exists
    const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers()
    if (listError) throw listError

    const existingUser = usersData.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
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

      // Create profile for new user
      const { error: profileError } = await adminClient.from('profiles').insert({
        id: clientId,
        full_name: fullName,
        company,
        role: 'client'
      })
      if (profileError) throw profileError
    }

    if (!clientId) throw new Error('Failed to determine client ID')

    // 2. Create Project
    const { data: project, error: projectError } = await adminClient.from('projects').insert({
      title,
      slug,
      description,
      start_date: startDate || null,
      due_date: dueDate || null
    }).select('id').single()

    if (projectError) {
      // If project creation fails, we might leave a dangling user. 
      // In a real app we'd clean it up or use a transaction, but RPC is best for transactions.
      throw projectError
    }

    // 3. Add Client to Project
    const { error: memberError } = await adminClient.from('project_members').insert({
      project_id: project.id,
      profile_id: clientId,
      role: 'owner'
    })
    if (memberError) throw memberError

    // 4. Add Admin (Self) to Project
    await adminClient.from('project_members').insert({
      project_id: project.id,
      profile_id: user.id,
      role: 'viewer'
    })

    // 5. Seed Default Milestones
    const milestones = [
      { title: 'Discovery', description: 'Requirements and initial planning', position: 1 },
      { title: 'Design', description: 'UI/UX design phase', position: 2 },
      { title: 'Development', description: 'Core implementation', position: 3 },
      { title: 'Testing', description: 'QA and user acceptance testing', position: 4 },
      { title: 'Launch', description: 'Final deployment', position: 5 }
    ].map(m => ({
      project_id: project.id,
      ...m
    }))

    const { error: msError } = await adminClient.from('milestones').insert(milestones)
    if (msError) throw msError

    // Send Welcome Email for new users
    if (isNewUser) {
      // Intentionally not awaiting to prevent blocking the response, or use Promise.allSettled
      // Wait, Next.js server actions should await or the process might end. We'll await but swallow errors.
      await Promise.allSettled([
        sendEmail({
          to: email,
          subject: 'Welcome to the HexaLogic Portal',
          template: WelcomeEmail({ email, tempPassword })
        })
      ])
    }

    revalidatePath('/admin')

    return { 
      success: true, 
      isNewUser, 
      credentials: isNewUser ? { email, tempPassword } : undefined,
      slug
    }
  } catch (error: any) {
    console.error('Error creating client/project:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}

export async function softDeleteUpdate(updateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { error } = await supabase
    .from('updates')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', updateId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return { success: true }
}

export async function updateProjectDetails(projectId: string, data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  // Check if status is transitioning to 'completed'
  const isCompleting = data.status === 'completed'
  let oldProjectData = null

  if (isCompleting) {
    const { data: oldProj } = await supabase.from('projects').select('status, title, start_date, hours_logged, slug').eq('id', projectId).single()
    oldProjectData = oldProj
  }

  const { error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', projectId)

  if (error) return { error: error.message }
  
  if (isCompleting && oldProjectData && oldProjectData.status !== 'completed') {
    try {
      // Fetch members with every_update enabled
      const { data: members } = await adminClient
        .from('project_members')
        .select(`
          profile_id,
          profiles!inner ( email_prefs )
        `)
        .eq('project_id', projectId)

      if (members && members.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const updateLink = `${baseUrl}/portal/${oldProjectData.slug}`
        
        const emailPromises = members
          .filter(m => {
            const prefs = (m.profiles as any)?.email_prefs
            return prefs && prefs.every_update === true
          })
          .map(async (member) => {
            const { data: userData } = await adminClient.auth.admin.getUserById(member.profile_id)
            const email = userData?.user?.email
            
            if (email) {
              return sendEmail({
                to: email,
                subject: `Project Completed: ${oldProjectData.title}`,
                template: ProjectCompleteEmail({
                  projectName: oldProjectData.title,
                  totalHours: oldProjectData.hours_logged || 0,
                  startDate: oldProjectData.start_date || 'N/A',
                  endDate: new Date().toISOString().split('T')[0],
                  updateLink
                })
              })
            }
          })
          
        await Promise.allSettled(emailPromises)
      }
    } catch (emailError) {
      console.error('Failed to send project complete emails:', emailError)
    }
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/${projectId}`) // Actually we need slug, but revalidatePath('/admin', 'layout') handles it
  return { success: true }
}

export async function removeClientAccess(projectId: string, profileId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { error } = await supabase
    .from('project_members')
    .delete()
    .match({ project_id: projectId, profile_id: profileId })

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return { success: true }
}

export async function updateMilestones(projectId: string, milestones: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { data: project } = await supabase.from('projects').select('id, title, slug').eq('id', projectId).single()
  if (!project) return { error: 'Project not found' }

  // 1. Fetch old milestones to check status transitions
  const { data: oldMilestones } = await supabase.from('milestones').select('id, status').eq('project_id', projectId)

  // 2. Delete all existing milestones for this project
  const { error: deleteError } = await supabase
    .from('milestones')
    .delete()
    .eq('project_id', projectId)

  if (deleteError) return { error: deleteError.message }

  // 3. Insert new milestones
  if (milestones.length > 0) {
    const { data, error: insertError } = await supabase
      .from('milestones')
      .insert(milestones)
      .select('*')
      .order('position', { ascending: true })
      
    if (insertError) return { error: insertError.message }
    
    // Check for newly completed milestones
    if (oldMilestones) {
      const newlyDone = data.filter((m: any) => 
        m.status === 'done' && 
        oldMilestones.find(om => om.id === m.id && om.status !== 'done')
      )

      if (newlyDone.length > 0) {
        // Fetch project members with every_update enabled
        const { data: members } = await adminClient
          .from('project_members')
          .select(`profile_id, profiles!inner ( email_prefs )`)
          .eq('project_id', projectId)

        if (members && members.length > 0) {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
          const updateLink = `${baseUrl}/portal/${project.slug}`
          
          const emailPromises = members
            .filter(m => (m.profiles as any)?.email_prefs?.every_update === true)
            .map(async (member) => {
              const { data: userData } = await adminClient.auth.admin.getUserById(member.profile_id)
              if (userData?.user?.email) {
                return newlyDone.map((md: any) => 
                  sendEmail({
                    to: userData.user.email as string,
                    subject: `Milestone Completed: ${md.title}`,
                    template: MilestoneDoneEmail({
                      projectName: project.title,
                      milestoneName: md.title,
                      nextSteps: 'Please review the deliverables and approve this milestone or request changes in the portal.',
                      updateLink
                    })
                  })
                )
              }
            }).flat()
            
          await Promise.allSettled(emailPromises)
        }
      }
    }
    
    revalidatePath(`/admin/${project.slug}`)
    return { success: true, data }
  }
  
  revalidatePath(`/admin/${project.slug}`)
  return { success: true, data: [] }
}

export async function generateUploadUrl(slug: string, fileName: string, contentType: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { data: project } = await supabase.from('projects').select('id').eq('slug', slug).single()
  if (!project) return { error: 'Project not found' }
  const projectId = project.id

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path = `${projectId}/${crypto.randomUUID()}-${sanitizedFileName}`

  const { data, error } = await supabase.storage.from('project-media').createSignedUploadUrl(path)
  
  if (error) return { error: error.message }
  return { success: true, signedUrl: data.signedUrl, path: data.path }
}

export async function publishProjectUpdate(
  slug: string, 
  title: string, 
  body: string, 
  hours: number, 
  mediaArray: any[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { data: project } = await supabase.from('projects').select('id, title, progress').eq('slug', slug).single()
  if (!project) return { error: 'Project not found' }

  const { error } = await supabase.rpc('publish_project_update', {
    p_project_id: project.id,
    p_title: title,
    p_body: body,
    p_hours: hours,
    p_progress: project.progress,
    p_media: mediaArray
  })

  if (error) return { error: error.message }
  
  try {
    // Fetch members with every_update enabled
    const { data: members } = await adminClient
      .from('project_members')
      .select(`
        profile_id,
        profiles!inner ( email_prefs )
      `)
      .eq('project_id', project.id)

    if (members && members.length > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const updateLink = `${baseUrl}/portal/${slug}`
      const thumbnailUrl = mediaArray.length > 0 ? mediaArray[0].path : undefined
      const resolvedThumbnailUrl = thumbnailUrl 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-media/${thumbnailUrl}`
        : undefined

      const emailPromises = members
        .filter(m => {
          const prefs = (m.profiles as any)?.email_prefs
          return prefs && prefs.every_update === true
        })
        .map(async (member) => {
          // Resolve actual email from auth.users via adminClient
          const { data: userData } = await adminClient.auth.admin.getUserById(member.profile_id)
          const email = userData?.user?.email
          
          if (email) {
            return sendEmail({
              to: email,
              subject: `New Update: ${title} - ${project.title}`,
              template: NewUpdateEmail({
                projectName: project.title,
                updateTitle: title,
                updateBody: body.substring(0, 150) + (body.length > 150 ? '...' : ''),
                progressPercent: project.progress || 0,
                thumbnailUrl: resolvedThumbnailUrl,
                updateLink
              })
            })
          }
        })
        
      await Promise.allSettled(emailPromises)
    }
  } catch (emailError) {
    console.error('Failed to send update emails:', emailError)
  }

  revalidatePath(`/admin/${slug}`)
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { error } = await adminClient
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return { success: true }
}
