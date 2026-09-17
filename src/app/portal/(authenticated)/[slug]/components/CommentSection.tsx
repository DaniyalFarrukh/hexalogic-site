'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { User, MessageSquare, ImageIcon, Send, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { postComment } from '../actions'
import { createClient } from '@/lib/supabase/client'
import LocalTime from '@/components/portal/LocalTime'

export type CommentType = {
  id: string
  body: string
  created_at: string
  deleted_at: string | null
  author?: {
    full_name: string | null
    avatar_url: string | null
    role: string | null
  } | null
  media?: {
    id: string
    path: string
    kind: string
  }[]
}

type Profile = { id: string; full_name: string | null; avatar_url: string | null; role: string | null }

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024

export function CommentSection({
  projectId,
  targetType,
  targetId,
  comments
}: {
  projectId: string
  targetType: 'update' | 'milestone'
  targetId: string
  comments: CommentType[]
}) {
  const router = useRouter()
  const inputId = useId()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Comments arriving in real time from other people, merged with the server list.
  const [liveComments, setLiveComments] = useState<CommentType[]>([])
  const [pending, setPending] = useState<CommentType | null>(null)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const currentUserRef = useRef<Profile | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user || cancelled) return
      const { data } = await supabase.from('profiles').select('id, full_name, avatar_url, role').eq('id', user.id).single()
      if (cancelled) return
      const profile: Profile = data ? data : { id: user.id, full_name: null, avatar_url: null, role: null }
      currentUserRef.current = profile
      setCurrentUser(profile)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`comments-${targetId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `${targetType}_id=eq.${targetId}` },
        async (payload) => {
          const row = payload.new as { id: string; body: string; created_at: string; deleted_at: string | null; author_id: string }
          if (currentUserRef.current && row.author_id === currentUserRef.current.id) return

          const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', row.author_id).single()
          const newComment: CommentType = {
            id: row.id,
            body: row.body,
            created_at: row.created_at,
            deleted_at: row.deleted_at,
            author: profile || undefined,
            media: []
          }
          setLiveComments(prev => prev.some(c => c.id === newComment.id) ? prev : [...prev, newComment])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [targetId, targetType])

  const serverIds = new Set(comments.map(c => c.id))
  const visible = [
    ...comments,
    ...liveComments.filter(c => !serverIds.has(c.id)),
    ...(pending ? [pending] : []),
  ].filter(c => !c.deleted_at)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() && !file) return

    setIsSubmitting(true)
    setError(null)

    if (currentUser) {
      setPending({
        id: `pending-${Date.now()}`,
        body,
        created_at: new Date().toISOString(),
        deleted_at: null,
        author: { full_name: currentUser.full_name, avatar_url: currentUser.avatar_url, role: currentUser.role },
      })
    }

    const formData = new FormData()
    formData.append('projectId', projectId)
    formData.append('targetType', targetType)
    formData.append('targetId', targetId)
    formData.append('body', body)
    if (file) formData.append('file', file)

    const result = await postComment(formData)

    if (result?.error) {
      setError(result.error)
      setPending(null)
      setIsSubmitting(false)
      return
    }

    setBody('')
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setIsSubmitting(false)
    router.refresh()
    // Keep the optimistic entry briefly so the list does not flicker before the refresh lands.
    setTimeout(() => setPending(null), 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) {
      setError('Only image files can be attached to comments')
      e.target.value = ''
      return
    }
    if (selected.size > MAX_ATTACHMENT_BYTES) {
      setError('Image must be under 5MB')
      e.target.value = ''
      return
    }
    setFile(selected)
    setError(null)
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-brand-primary" />
        Comments ({visible.length})
      </h3>

      <div className="space-y-6 mb-8">
        {visible.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet. Be the first to start the conversation.</p>
        ) : (
          visible.map(comment => (
            <div key={comment.id} className={`flex gap-3 sm:gap-4 ${comment.id.startsWith('pending-') ? 'opacity-60' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {comment.author?.avatar_url ? (
                  <Image src={comment.author.avatar_url} alt="" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                ) : (
                  <User className="w-5 h-5 text-gray-400" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 min-w-0 bg-gray-50 rounded-xl rounded-tl-none p-4 border border-gray-200 shadow-sm">
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{comment.author?.full_name || 'Unknown User'}</span>
                    {comment.author?.role === 'admin' && (
                      <span className="bg-brand-primary/10 text-brand-primary text-xs px-2 py-0.5 rounded-full font-medium">HexaLogic</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    <LocalTime utcString={comment.created_at} formatOptions={{ dateStyle: 'medium', timeStyle: 'short' }} />
                  </span>
                </div>
                {comment.body && (
                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed break-words">{comment.body}</p>
                )}

                {comment.media && comment.media.length > 0 && (
                  <a href={`/api/media/${comment.media[0].id}`} target="_blank" rel="noreferrer" className="mt-4 relative h-48 max-w-xs w-full block group overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={`/api/media/${comment.media[0].id}`}
                      alt="Attachment"
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 320px"
                      unoptimized
                    />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {error && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden focus-within:border-brand-primary focus-within:shadow-[0_0_15px_rgba(255,115,36,0.15)] transition-all duration-300 shadow-sm">
          <label htmlFor={inputId} className="sr-only">Write a comment</label>
          <textarea
            id={inputId}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 p-4 min-h-[100px] outline-none resize-y"
            disabled={isSubmitting}
          />

          {file && (
            <div className="px-4 pb-2">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md pl-3 pr-1 py-1">
                <ImageIcon className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 px-4 py-3 flex flex-wrap justify-between items-center gap-3 border-t border-gray-200">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-500 hover:text-brand-primary transition-colors flex items-center gap-2 text-sm font-medium min-h-[44px]"
              disabled={isSubmitting}
            >
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
              Attach Screenshot
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!body.trim() && !file)}
              className="bg-brand-primary hover:bg-[#ff8947] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm min-h-[44px]"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
