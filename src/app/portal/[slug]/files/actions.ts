'use server'

import { createClient } from '@/lib/supabase/server'

export async function getFileUploadUrl(projectId: string, fileName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Check if member or admin
  const { data: projectMember } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('profile_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!projectMember && profile?.role !== 'admin') {
    return { error: 'Forbidden' }
  }

  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
  const path = `${projectId}/${crypto.randomUUID()}-${sanitizedFileName}`

  const { data, error } = await supabase.storage.from('project-media').createSignedUploadUrl(path)
  
  if (error) return { error: error.message }
  return { success: true, signedUrl: data.signedUrl, path: data.path }
}

export async function saveFileRecord(
  projectId: string, 
  fileData: { path: string, kind: string, caption?: string, size_bytes: number, mime_type: string }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // We rely on RLS policies to enforce project_id insertion access,
  // but let's be safe and check access here as well.
  const { data: projectMember } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('profile_id', user.id)
    .single()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!projectMember && profile?.role !== 'admin') {
    return { error: 'Forbidden' }
  }

  const { error } = await supabase.from('media').insert({
    project_id: projectId,
    path: fileData.path,
    kind: fileData.kind,
    caption: fileData.caption,
    size_bytes: fileData.size_bytes,
    mime_type: fileData.mime_type
  })

  if (error) {
    console.error('Error saving file record:', error)
    return { error: error.message }
  }

  // Also log the activity
  await supabase.from('activity_log').insert({
    project_id: projectId,
    actor_id: user.id,
    event_type: 'file_uploaded',
    payload: { path: fileData.path, kind: fileData.kind }
  })

  return { success: true }
}

export async function deleteMediaRecord(mediaId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Forbidden. Only admins can delete media.' }
  }

  const { data: media } = await supabase
    .from('media')
    .select('path')
    .eq('id', mediaId)
    .single()

  if (media && media.path && !media.path.startsWith('http')) {
    await supabase.storage.from('project-media').remove([media.path])
  }

  const { error } = await supabase.from('media').delete().eq('id', mediaId)

  if (error) {
    console.error('Error deleting file record:', error)
    return { error: error.message }
  }

  return { success: true }
}
