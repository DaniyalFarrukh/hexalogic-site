'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import imageCompression from 'browser-image-compression'
import { generateUploadUrl, publishProjectUpdate, type MediaInput } from '@/app/admin/admin-actions'
import { kindFromMime, kindFromUrl } from '@/lib/media'

const MAX_VIDEO_BYTES = 100 * 1024 * 1024

const inputClass =
  'w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors'
const labelClass = 'text-[10px] font-bold text-gray-500 uppercase tracking-widest'

export default function PostUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [progressText, setProgressText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [hours, setHours] = useState('0')
  const [files, setFiles] = useState<File[]>([])
  const [externalUrl, setExternalUrl] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : [])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const mediaArray: MediaInput[] = []

      for (const [index, file] of files.entries()) {
        let uploadFile = file
        setProgressText(`Uploading ${index + 1} of ${files.length}: ${file.name}`)

        if (file.type.startsWith('image/')) {
          uploadFile = await imageCompression(file, { maxSizeMB: 8, maxWidthOrHeight: 2560, useWebWorker: true })
        } else if (file.type.startsWith('video/') && file.size > MAX_VIDEO_BYTES) {
          throw new Error(`Video ${file.name} exceeds the 100MB limit. Please use an external URL instead.`)
        }

        const urlRes = await generateUploadUrl(slug, uploadFile.name)
        if (urlRes.error || !urlRes.signedUrl || !urlRes.path) throw new Error(urlRes.error || 'Failed to generate upload URL')

        const uploadRes = await fetch(urlRes.signedUrl, {
          method: 'PUT',
          body: uploadFile,
          headers: { 'Content-Type': uploadFile.type }
        })
        if (!uploadRes.ok) throw new Error(`Failed to upload ${uploadFile.name}`)

        mediaArray.push({
          path: urlRes.path,
          kind: kindFromMime(uploadFile.type),
          size_bytes: uploadFile.size,
          mime_type: uploadFile.type,
          caption: file.name
        })
      }

      const trimmedUrl = externalUrl.trim()
      if (trimmedUrl) {
        mediaArray.push({
          path: trimmedUrl,
          kind: kindFromUrl(trimmedUrl),
          size_bytes: 0,
          mime_type: 'text/uri-list',
          caption: null
        })
      }

      setProgressText('Publishing update...')
      const pubRes = await publishProjectUpdate(slug, title, body, parseFloat(hours) || 0, mediaArray)
      if (pubRes.error) throw new Error(pubRes.error)

      toast.success('Update published')
      router.push(`/admin/${slug}/updates`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
      setLoading(false)
      setProgressText('')
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/admin/${slug}/updates`} className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          &larr; Back to Project
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Post Update</h1>
        <p className="text-sm text-gray-500 mt-1">Clients who opted in will receive an email as soon as this is published.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3 space-y-1">
              <label htmlFor="title" className={labelClass}>Update Title</label>
              <input id="title" required value={title} onChange={e => setTitle(e.target.value)} type="text" className={inputClass} />
            </div>
            <div className="sm:col-span-1 space-y-1">
              <label htmlFor="hours" className={labelClass}>Hours logged</label>
              <input id="hours" required value={hours} onChange={e => setHours(e.target.value)} type="number" min="0" step="0.25" className={inputClass} />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="body" className={labelClass}>Update Details</label>
            <textarea id="body" required value={body} onChange={e => setBody(e.target.value)} rows={8} className={`${inputClass} resize-y`} />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Attach Media</h3>

            <div className="space-y-1">
              <label htmlFor="files" className={labelClass}>Upload Files (images up to 10MB, videos up to 100MB)</label>
              <input
                id="files"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-brand-secondary hover:file:bg-gray-200 cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Images are compressed automatically before upload.</p>
              {files.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="truncate">{f.name}</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-xs font-bold text-gray-400 hover:text-red-500 ml-3 min-h-[32px]">Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest my-2">- or -</div>

            <div className="space-y-1">
              <label htmlFor="externalUrl" className={labelClass}>External link (YouTube, Loom, Drive, or large videos)</label>
              <input
                id="externalUrl"
                value={externalUrl}
                onChange={e => setExternalUrl(e.target.value)}
                type="url"
                placeholder="https://youtube.com/..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
            {progressText && <span className="text-xs text-gray-500">{progressText}</span>}
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-secondary text-white px-8 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
