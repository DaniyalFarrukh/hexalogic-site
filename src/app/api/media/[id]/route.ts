import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // RLS protects this query: user can only select media linked to projects they are members of.
  const { data: mediaRecord, error } = await supabase
    .from('media')
    .select('path')
    .eq('id', id)
    .single()

  if (error || !mediaRecord) {
    return new NextResponse('Not Found or Forbidden', { status: 404 })
  }

  // 1. External URL Branch (Edge Cacheable)
  if (mediaRecord.path.startsWith('http://') || mediaRecord.path.startsWith('https://')) {
    return NextResponse.redirect(mediaRecord.path, 307)
  }

  // 2. Supabase Storage Branch (Short-lived signed URL, MUST NOT BE CACHED)
  const { data: signedData, error: signError } = await supabase
    .storage
    .from('project-media')
    .createSignedUrl(mediaRecord.path, 60)

  if (signError || !signedData) {
    return new NextResponse('Error generating signed URL', { status: 500 })
  }

  return NextResponse.redirect(signedData.signedUrl, 307)
}
