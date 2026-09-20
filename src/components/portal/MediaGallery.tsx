'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Download, Trash2, X, ChevronLeft, ChevronRight, Upload, FileText, PlayCircle, FolderOpen } from 'lucide-react'
import LocalTime from './LocalTime'
import { getFileUploadUrl, saveFileRecord, deleteMediaRecord } from '@/app/portal/(authenticated)/[slug]/files/actions'
import { formatBytes, kindFromMime } from '@/lib/media'
import { PdfThumbnail, DocxThumbnail, FallbackIcon, OfficeViewer, PdfViewer } from './DocumentPreview'

export type MediaItem = {
  id: string
  path: string
  kind: 'image' | 'video' | 'file' | string
  caption?: string | null
  mime_type?: string | null
  size_bytes?: number | null
  created_at: string
  signedUrl?: string
}

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024

export default function MediaGallery({ media, projectId, isAdmin }: { media: MediaItem[]; projectId?: string; isAdmin?: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  const activeMedia = lightboxIndex !== null ? media[lightboxIndex] : null
  const canManage = Boolean(projectId && isAdmin)

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(() => setLightboxIndex(i => (i === null ? null : i > 0 ? i - 1 : media.length - 1)), [media.length])
  const showNext = useCallback(() => setLightboxIndex(i => (i === null ? null : i < media.length - 1 ? i + 1 : 0)), [media.length])

  // Keyboard navigation and scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !projectId) return

    if (file.size > MAX_UPLOAD_BYTES) {
      toast.error('Files must be under 100MB')
      e.target.value = ''
      return
    }

    setIsUploading(true)
    try {
      const kind = kindFromMime(file.type)
      const { success, signedUrl, path, error: urlError } = await getFileUploadUrl(projectId, file.name)
      if (!success || !signedUrl || !path) throw new Error(urlError || 'Failed to get upload URL')

      const uploadRes = await fetch(signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      if (!uploadRes.ok) throw new Error('Failed to upload file to storage')

      const { success: dbSuccess, error: dbError } = await saveFileRecord(projectId, {
        path,
        kind,
        caption: file.name,
        size_bytes: file.size,
        mime_type: file.type
      })
      if (!dbSuccess) throw new Error(dbError || 'Failed to save file record')

      toast.success('File uploaded')
      router.refresh()
    } catch (err) {
      console.error('Upload failed:', err)
      toast.error(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
      setIsUploading(false)
    }
  }

  const handleDelete = async (mediaId: string) => {
    setIsDeletingId(mediaId)
    try {
      const { success, error } = await deleteMediaRecord(mediaId)
      if (!success) throw new Error(error || 'Failed to delete media')
      if (activeMedia?.id === mediaId) closeLightbox()
      toast.success('File deleted')
      router.refresh()
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error(err instanceof Error ? err.message : 'Delete failed. Please try again.')
    } finally {
      setIsDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>, mediaId: string, filename: string) => {
    e.preventDefault()
    
    // Show a loading toast for larger files
    const toastId = toast.loading(`Downloading ${filename}...`)
    
    try {
      const response = await fetch(`/api/media/${mediaId}?download=true`)
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Download complete', { id: toastId })
    } catch (err) {
      console.error('Download error:', err)
      toast.error('Failed to download file', { id: toastId })
    }
  }

  const mediaSrc = (item: MediaItem) => item.signedUrl || `/api/media/${item.id}`

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Project Files &amp; Media</h2>
          <p className="text-sm text-gray-500 mt-1">Designs, documents and media shared on this project.</p>
        </div>
        {canManage && (
          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.zip"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-brand-secondary hover:bg-[#ff8947] text-white px-4 py-2 min-h-[44px] rounded-lg text-sm font-bold transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" aria-hidden="true" />
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>
        )}
      </div>

      {!media || media.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <FolderOpen className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
          <p>No files or media have been uploaded to this project yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <div key={item.id} className="relative group">
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open ${item.caption || item.kind}`}
                className="w-full aspect-square relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm hover:border-brand-secondary/50 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              >
                {item.kind === 'image' ? (
                  <Image
                    src={mediaSrc(item)}
                    alt={item.caption || 'Project media'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : item.kind === 'video' ? (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-secondary p-4">
                    <PlayCircle className="w-10 h-10 mb-2" aria-hidden="true" />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center">{item.caption || 'Video'}</span>
                  </div>
                ) : item.mime_type?.includes('pdf') ? (
                  <PdfThumbnail url={mediaSrc(item)} />
                ) : item.mime_type?.includes('word') || item.mime_type?.includes('document') ? (
                  <DocxThumbnail url={mediaSrc(item)} />
                ) : (
                  <FallbackIcon mimeType={item.mime_type} caption={item.caption} />
                )}
              </button>
              {canManage && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(item.id)}
                  disabled={isDeletingId === item.id}
                  className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-white/90 text-gray-600 shadow hover:bg-red-500 hover:text-white transition-colors"
                  aria-label={`Delete ${item.caption || item.kind}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              {confirmDeleteId === item.id && (
                <div className="absolute inset-0 z-20 bg-white/95 rounded-xl border border-red-200 flex flex-col items-center justify-center gap-2 p-3 text-center">
                  <p className="text-xs font-semibold text-gray-800">Delete this file?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900">Cancel</button>
                    <button type="button" onClick={() => handleDelete(item.id)} disabled={isDeletingId === item.id} className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50">
                      {isDeletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && activeMedia && (
        <div
          className="fixed inset-0 z-[100] bg-surface-darkest/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeMedia.caption || 'Media preview'}
          onClick={closeLightbox}
        >
          <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 z-[110]" onClick={(e) => e.stopPropagation()}>
            <a
              href={`/api/media/${activeMedia.id}?download=true`}
              onClick={(e) => handleDownload(e, activeMedia.id, activeMedia.caption || 'download')}
              className="text-gray-300 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-lg"
              aria-label="Download media"
            >
              <Download className="w-6 h-6" aria-hidden="true" />
            </a>
            {canManage && (
              <button
                type="button"
                onClick={() => setConfirmDeleteId(activeMedia.id)}
                disabled={isDeletingId === activeMedia.id}
                className="text-gray-300 hover:text-red-400 transition-colors p-2.5 hover:bg-white/10 rounded-lg"
                aria-label="Delete media"
              >
                <Trash2 className="w-6 h-6" aria-hidden="true" />
              </button>
            )}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              className="text-gray-300 hover:text-white transition-colors p-2.5 hover:bg-white/10 rounded-lg"
              aria-label="Close gallery"
            >
              <X className="w-7 h-7" aria-hidden="true" />
            </button>
          </div>

          {confirmDeleteId === activeMedia.id && (
            <div className="absolute top-20 right-4 md:right-6 z-[120] bg-white rounded-xl p-4 shadow-xl text-sm text-gray-800 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <span>Delete this file?</span>
              <button type="button" onClick={() => setConfirmDeleteId(null)} className="text-xs font-bold text-gray-600">Cancel</button>
              <button type="button" onClick={() => handleDelete(activeMedia.id)} className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded">Delete</button>
            </div>
          )}

          <div className="w-full max-w-5xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
              {activeMedia.kind === 'image' ? (
                <div className="relative w-full h-[70vh] md:h-[80vh]">
                  <Image
                    src={mediaSrc(activeMedia)}
                    alt={activeMedia.caption || 'Project media full view'}
                    fill
                    className="object-contain rounded-lg shadow-2xl"
                    sizes="100vw"
                  />
                </div>
              ) : activeMedia.kind === 'video' ? (
                <video
                  src={mediaSrc(activeMedia)}
                  controls
                  preload="metadata"
                  className="max-w-full max-h-[70vh] md:max-h-[80vh] rounded-lg shadow-2xl bg-black"
                />
              ) : activeMedia.mime_type?.includes('pdf') ? (
                <PdfViewer url={mediaSrc(activeMedia)} />
              ) : activeMedia.mime_type?.includes('word') || activeMedia.mime_type?.includes('document') || activeMedia.mime_type?.includes('excel') || activeMedia.mime_type?.includes('sheet') || activeMedia.mime_type?.includes('powerpoint') || activeMedia.mime_type?.includes('presentation') ? (
                <OfficeViewer url={mediaSrc(activeMedia)} />
              ) : (
                <div className="text-center p-8 sm:p-12 bg-white rounded-2xl max-w-md w-full">
                  <div className="w-20 h-20 mx-auto mb-6 text-brand-secondary bg-brand-secondary/10 flex items-center justify-center rounded-full">
                    <FileText className="w-10 h-10" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 break-words">{activeMedia.caption || 'Document'}</h3>
                  <p className="text-gray-500 text-sm mb-8">{activeMedia.mime_type || 'Unknown format'}</p>
                  <a
                    href={`/api/media/${activeMedia.id}?download=true`}
                    onClick={(e) => handleDownload(e, activeMedia.id, activeMedia.caption || 'download')}
                    className="inline-flex items-center gap-2 bg-brand-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-[#ff8947] transition-all shadow-lg"
                  >
                    <Download className="w-5 h-5" aria-hidden="true" />
                    Download File
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-6 flex flex-col items-center max-w-lg text-center">
              {activeMedia.caption && activeMedia.kind !== 'file' && (
                <p className="text-white mb-2 font-medium break-words">{activeMedia.caption}</p>
              )}
              <div className="text-xs text-gray-300 uppercase tracking-widest flex flex-wrap items-center justify-center gap-3 bg-white/5 px-4 py-2 rounded-full">
                <span className="font-semibold text-brand-secondary">{activeMedia.kind}</span>
                <span><LocalTime utcString={activeMedia.created_at} /></span>
                {activeMedia.size_bytes ? <span>{formatBytes(activeMedia.size_bytes)}</span> : null}
                {media.length > 1 && <span>{lightboxIndex + 1} / {media.length}</span>}
              </div>
            </div>
          </div>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showPrev() }}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-black/60 backdrop-blur z-[110]"
                aria-label="Previous media"
              >
                <ChevronLeft className="w-7 h-7" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); showNext() }}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white rounded-full bg-black/40 hover:bg-black/60 backdrop-blur z-[110]"
                aria-label="Next media"
              >
                <ChevronRight className="w-7 h-7" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
