import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MediaGallery from '@/components/portal/MediaGallery'

export default async function FilesPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('slug', params.slug)
    .single()

  if (!project) notFound()

  // Fetch all media related to this project
  const [
    { data: directMedia },
    { data: updateMedia },
    { data: commentMedia }
  ] = await Promise.all([
    supabase.from('media').select('*').eq('project_id', project.id),
    supabase.from('media').select('*, updates!inner(project_id)').eq('updates.project_id', project.id),
    supabase.from('media').select('*, comments!inner(project_id)').eq('comments.project_id', project.id)
  ])

  const allMedia = [
    ...(directMedia || []),
    ...(updateMedia || []),
    ...(commentMedia || [])
  ]

  // Deduplicate and sort
  const uniqueMedia = Array.from(new Map(allMedia.map(m => [m.id, m])).values())
  uniqueMedia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  let galleryMedia = uniqueMedia
  if (galleryMedia.length > 0) {
    const internalPaths = galleryMedia
      .filter(m => !m.path.startsWith('http://') && !m.path.startsWith('https://'))
      .map(m => m.path)
    
    if (internalPaths.length > 0) {
      const { data: signedUrls } = await supabase
        .storage
        .from('project-media')
        .createSignedUrls(internalPaths, 60 * 60)
      
      if (signedUrls) {
        galleryMedia = galleryMedia.map(m => {
          if (m.path.startsWith('http://') || m.path.startsWith('https://')) return { ...m, signedUrl: m.path }
          const signed = signedUrls.find(s => s.path === m.path)
          return { ...m, signedUrl: signed?.signedUrl }
        })
      }
    }
  }

  return <MediaGallery media={galleryMedia} projectId={project.id} />
}
