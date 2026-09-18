'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { encryptCredential, DECRYPT_FAILED_SENTINEL } from '@/lib/crypto/credentials'

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
  // The UI substitutes this for a password it failed to decrypt (wrong/rotated key). Refuse to
  // save it back as a "real" password — that would permanently overwrite the original ciphertext.
  if (password === DECRYPT_FAILED_SENTINEL) {
    return { error: 'This password could not be decrypted, so it can’t be re-saved as-is. Fix CREDENTIALS_ENCRYPTION_KEY, or enter a new password to replace it.' }
  }

  return { value: { title, url: url || null, username, password, notes: notes || null } }
}

function encryptOrError(password: string): { value: string } | { error: string } {
  try {
    return { value: encryptCredential(password) }
  } catch (err) {
    console.error('Failed to encrypt credential:', err)
    return { error: 'Could not save this credential — encryption is not configured correctly (CREDENTIALS_ENCRYPTION_KEY).' }
  }
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

  const encrypted = encryptOrError(parsed.value.password)
  if ('error' in encrypted) return { error: encrypted.error }

  const { error } = await supabase.from('credentials').insert({
    project_id: projectId,
    ...parsed.value,
    password: encrypted.value,
  })
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

  const encrypted = encryptOrError(parsed.value.password)
  if ('error' in encrypted) return { error: encrypted.error }

  const { data: row, error } = await supabase.from('credentials').update({
    ...parsed.value,
    password: encrypted.value,
  }).eq('id', id).select('project_id').single()
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
