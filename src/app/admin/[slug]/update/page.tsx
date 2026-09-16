'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import imageCompression from 'browser-image-compression'
import { generateUploadUrl, publishProjectUpdate } from '@/app/admin/admin-actions'

export default function PostUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [hours, setHours] = useState('0')
  const [files, setFiles] = useState<File[]>([])
  const [externalUrl, setExternalUrl] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const mediaArray: any[] = []

      // 1. Upload Files
      for (const file of files) {
        let uploadFile = file
        
        // Compress images
        if (file.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 8, // Enforce 10MB limit safely
            maxWidthOrHeight: 2560,
            useWebWorker: true
          }
          uploadFile = await imageCompression(file, options)
        } else if (file.type.startsWith('video/') && file.size > 100 * 1024 * 1024) {
          throw new Error(`Video ${file.name} exceeds 100MB bucket limit. Please use an external URL.`)
        }

        // Generate signed URL
        const urlRes = await generateUploadUrl(slug, uploadFile.name, uploadFile.type)
        if (urlRes.error || !urlRes.signedUrl) throw new Error(urlRes.error || 'Failed to generate upload URL')

        // Direct upload to Supabase Storage
        const uploadRes = await fetch(urlRes.signedUrl, {
          method: 'PUT',
          body: uploadFile,
          headers: {
            'Content-Type': uploadFile.type
          }
        })

        if (!uploadRes.ok) throw new Error(`Failed to upload ${uploadFile.name}`)

        mediaArray.push({
          path: urlRes.path,
          kind: uploadFile.type.startsWith('image/') ? 'image' : 'video',
          size_bytes: uploadFile.size,
          mime_type: uploadFile.type,
          caption: null
        })
      }

      // Add external URL if provided
      if (externalUrl) {
        mediaArray.push({
          path: externalUrl,
          kind: 'video', // Assume external URLs are video for now
          size_bytes: 0,
          mime_type: 'text/uri-list',
          caption: null
        })
      }

      // 2. Publish Update
      const pubRes = await publishProjectUpdate(slug, title, body, parseFloat(hours) || 0, mediaArray)
      if (pubRes.error) throw new Error(pubRes.error)

      router.push(`/admin/${slug}`)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/admin/${slug}`} className="text-gray-400 hover:text-white transition-colors">
          &larr; Back to Project
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-wider">Post Update</h1>
      </div>

      <div className="bg-surface-dark border border-white/10 rounded-xl p-8 shadow-xl">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update Title</label>
              <input 
                required 
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text" 
                className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" 
              />
            </div>
            <div className="col-span-1 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hours</label>
              <input 
                required 
                value={hours}
                onChange={e => setHours(e.target.value)}
                type="number" 
                min="0"
                step="0.25"
                className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update Details</label>
            <textarea 
              required
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
              className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors resize-none" 
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white">Attach Media</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Upload Files (Images &lt;10MB, Videos &lt;100MB)</label>
              <input 
                type="file" 
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-surface-darkest file:text-brand-primary hover:file:bg-surface-darkest/80 cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">Images will be compressed automatically before upload.</div>
            </div>

            <div className="text-center text-xs text-gray-500 font-bold uppercase tracking-widest my-2">- OR -</div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">External Video URL (For &gt;100MB Videos)</label>
              <input 
                value={externalUrl}
                onChange={e => setExternalUrl(e.target.value)}
                type="url" 
                placeholder="https://youtube.com/..."
                className="w-full bg-surface-darkest border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors" 
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-primary text-white px-8 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   Publishing...
                 </>
              ) : 'Publish Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
