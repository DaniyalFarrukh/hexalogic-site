'use client'

import { useState, useRef } from 'react'
import LocalTime from './LocalTime'
import Image from 'next/image'
import { getFileUploadUrl, saveFileRecord, deleteMediaRecord } from '@/app/portal/[slug]/files/actions'
import { useRouter } from 'next/navigation'

export default function MediaGallery({ media, projectId, isAdmin }: { media: any[], projectId?: string, isAdmin?: boolean }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !projectId) return

    setIsUploading(true)
    try {
      // Determine kind
      let kind = 'file'
      if (file.type.startsWith('image/')) kind = 'image'
      else if (file.type.startsWith('video/')) kind = 'video'

      // Get signed URL
      const { success, signedUrl, path, error: urlError } = await getFileUploadUrl(projectId, file.name)
      if (!success || !signedUrl || !path) {
        throw new Error(urlError || 'Failed to get upload URL')
      }

      // Upload directly to Supabase storage using the signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to storage')
      }

      // Save database record
      const { success: dbSuccess, error: dbError } = await saveFileRecord(projectId, {
        path,
        kind,
        caption: file.name,
        size_bytes: file.size,
        mime_type: file.type
      })

      if (!dbSuccess) {
        throw new Error(dbError || 'Failed to save file record')
      }

      // Reset and refresh
      if (fileInputRef.current) fileInputRef.current.value = ''
      router.refresh()
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return
    
    setIsDeletingId(mediaId)
    try {
      const { success, error } = await deleteMediaRecord(mediaId)
      if (!success) throw new Error(error || 'Failed to delete media')
      
      if (lightboxIndex !== null && media[lightboxIndex]?.id === mediaId) {
        setLightboxIndex(null)
      }
      
      router.refresh()
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Delete failed. Please try again.')
    } finally {
      setIsDeletingId(null)
    }
  }

  const activeMedia = lightboxIndex !== null ? media[lightboxIndex] : null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Project Files & Media</h2>
        {projectId && isAdmin && (
          <div className="flex items-center gap-3">
            {media && media.length > 0 && (
              <button
                onClick={() => setIsDeleteMode(!isDeleteMode)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm border flex items-center gap-2 ${
                  isDeleteMode 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {isDeleteMode ? 'Done' : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Files
                  </>
                )}
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
            />
            <button 
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-brand-secondary hover:bg-[#ff8947] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload File
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {!media || media.length === 0 ? (
        <div className="text-gray-500 text-sm py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <div className="w-12 h-12 mx-auto mb-3 text-gray-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>No files or media have been uploaded to this project yet.</p>
          <p className="text-xs mt-1 text-gray-500">Upload contracts, designs, or reference materials here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLightboxIndex(index)
                }
              }}
              onClick={(e) => {
                if (isDeleteMode) return // Prevent lightbox in delete mode
                setLightboxIndex(index)
              }}
              aria-label={`View ${item.caption || item.kind}`}
              className={`aspect-square relative rounded-xl overflow-hidden border transition-all group bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-secondary ${
                isDeleteMode ? 'border-red-300 ring-2 ring-red-500/20' : 'border-gray-200 hover:border-brand-secondary/50 hover:shadow-md hover:-translate-y-1 cursor-pointer'
              }`}
            >
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                  disabled={isDeletingId === item.id}
                  className={`absolute top-2 right-2 z-10 p-2 rounded-lg transition-all focus:opacity-100 ${
                    isDeleteMode 
                      ? 'opacity-100 bg-red-500 text-white shadow-lg hover:bg-red-600' 
                      : 'opacity-0 group-hover:opacity-100 bg-black/50 hover:bg-red-500 text-white'
                  }`}
                  aria-label="Delete file"
                >
                  {isDeletingId === item.id ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              )}
              {item.kind === 'image' ? (
                <Image 
                  src={item.signedUrl || `/api/media/${item.id}`} 
                  alt={item.caption || 'Project media'} 
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : item.kind === 'video' ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-secondary p-4">
                  <svg className="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full text-center">{item.caption || 'Video'}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-secondary p-4">
                  <div className="w-12 h-12 mb-3 bg-gray-200/50 rounded-full flex items-center justify-center group-hover:bg-brand-secondary/10 transition-colors">
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium truncate w-full text-center px-2 group-hover:text-white transition-colors">{item.caption || 'Document'}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 mt-1">{item.mime_type?.split('/')[1] || 'FILE'}</span>
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
        >
          <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
            <a 
              href={activeMedia.signedUrl || `/api/media/${activeMedia.id}`}
              download
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Download media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
            {isAdmin && (
              <button
                onClick={() => handleDelete(activeMedia.id)}
                disabled={isDeletingId === activeMedia.id}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete media"
              >
                {isDeletingId === activeMedia.id ? (
                  <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            )}
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary"
              aria-label="Close gallery"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full max-w-5xl max-h-full flex flex-col items-center">
            <div className="flex-1 w-full flex items-center justify-center min-h-0 relative">
              {activeMedia.kind === 'image' ? (
                <div className="relative w-full h-[80vh]">
                  <Image 
                    src={activeMedia.signedUrl || `/api/media/${activeMedia.id}`} 
                    alt={activeMedia.caption || 'Project media full view'} 
                    fill
                    className="object-contain rounded-lg shadow-2xl"
                    sizes="100vw"
                  />
                </div>
              ) : activeMedia.kind === 'video' ? (
                <video 
                  src={activeMedia.signedUrl || `/api/media/${activeMedia.id}`} 
                  controls
                  preload="metadata"
                  className="max-w-full max-h-[80vh] rounded-lg shadow-2xl bg-black"
                />
              ) : (
                <div className="text-center p-12 bg-surface-dark border border-white/10 rounded-2xl max-w-md w-full">
                  <div className="w-24 h-24 mx-auto mb-6 text-brand-secondary bg-brand-secondary/10 flex items-center justify-center rounded-full">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 truncate">{activeMedia.caption || 'Document'}</h3>
                  <p className="text-gray-400 text-sm mb-8">{activeMedia.mime_type || 'Unknown format'}</p>
                  <a 
                    href={activeMedia.signedUrl || `/api/media/${activeMedia.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-secondary text-white font-bold py-3 px-8 rounded-xl hover:bg-[#ff8947] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </a>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-col items-center max-w-lg text-center">
              {activeMedia.caption && activeMedia.kind !== 'file' && (
                <p className="text-white mb-2 font-medium">{activeMedia.caption}</p>
              )}
              <div className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full mt-2">
                <span className="font-semibold text-brand-secondary">{activeMedia.kind}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span><LocalTime utcString={activeMedia.created_at} /></span>
                {activeMedia.size_bytes && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <span>{(activeMedia.size_bytes / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {media.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : media.length - 1) }}
                className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded-full transition-colors bg-black/40 hover:bg-black/60 backdrop-blur z-[110]"
                aria-label="Previous media"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex < media.length - 1 ? lightboxIndex + 1 : 0) }}
                className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded-full transition-colors bg-black/40 hover:bg-black/60 backdrop-blur z-[110]"
                aria-label="Next media"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
