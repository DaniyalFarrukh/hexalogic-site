'use client'

import { useState, useRef, useEffect } from 'react'
import { User, MessageSquare, ImageIcon, Send, Clock, X } from 'lucide-react'
import { postComment } from '../actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export type CommentType = {
  id: string
  body: string
  created_at: string
  deleted_at: string | null
  author?: {
    full_name: string
    avatar_url: string | null
    role: string
  }
  media?: {
    id: string
    path: string
    kind: string
  }[]
}

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [body, setBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [localComments, setLocalComments] = useState(comments)
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
  const supabase = createClient()

  // Sync with server props
  useEffect(() => {
    setLocalComments(comments)
  }, [comments])

  // Fetch current user for optimistic UI
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setCurrentUserProfile(data)
      }
    })
  }, [supabase])

  // Subscribe to real-time incoming comments
  useEffect(() => {
    const channel = supabase.channel(`comments-${targetId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `${targetType}_id=eq.${targetId}` },
        async (payload) => {
          // If someone ELSE posted a comment, inject it immediately
          if (currentUserProfile && payload.new.author_id !== currentUserProfile.id) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', payload.new.author_id).single()
            
            const newComment: CommentType = {
              id: payload.new.id,
              body: payload.new.body,
              created_at: payload.new.created_at,
              deleted_at: payload.new.deleted_at,
              author: profile ? {
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                role: profile.role
              } : undefined,
              media: []
            }
            
            setLocalComments(prev => {
              // Prevent duplicates if already added somehow
              if (prev.some(c => c.id === newComment.id)) return prev
              return [...prev, newComment]
            })
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, targetId, targetType, currentUserProfile])

  const activeComments = localComments.filter(c => !c.deleted_at)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() && !file) return

    setIsSubmitting(true)
    setError(null)

    // Optimistic UI update for instant feedback
    if (currentUserProfile) {
      const optimisticComment: CommentType = {
        id: `optimistic-${Date.now()}`,
        body: body,
        created_at: new Date().toISOString(),
        deleted_at: null,
        author: {
          full_name: currentUserProfile.full_name || 'Sending...',
          avatar_url: currentUserProfile.avatar_url,
          role: currentUserProfile.role,
        }
      }
      setLocalComments(prev => [...prev, optimisticComment])
    }

    const formData = new FormData()
    formData.append('projectId', projectId)
    formData.append('targetType', targetType)
    formData.append('targetId', targetId)
    formData.append('body', body)
    if (file) {
      formData.append('file', file)
    }

    const result = await postComment(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
      // Rollback optimistic update
      setLocalComments(comments)
    } else {
      setBody('')
      setFile(null)
      setIsSubmitting(false)
      router.refresh() // This will fetch the real comment and update initial props
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB')
        return
      }
      setFile(selected)
      setError(null)
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-brand-primary" />
        Comments ({activeComments.length})
      </h3>

      <div className="space-y-6 mb-8">
        {activeComments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first to start the conversation!</p>
        ) : (
          activeComments.map(comment => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {comment.author?.avatar_url ? (
                  <img src={comment.author.avatar_url} alt={comment.author?.full_name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-none p-4 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{comment.author?.full_name || 'Unknown User'}</span>
                    {comment.author?.role === 'admin' && (
                      <span className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-0.5 rounded-full font-medium">HexaLogic</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed break-words overflow-hidden">{comment.body}</p>
                
                {comment.media && comment.media.length > 0 && (
                  <a href={`/api/media/${comment.media[0].id}`} target="_blank" rel="noreferrer" className="mt-4 relative h-48 max-w-xs w-full block group overflow-hidden rounded-lg">
                    <Image 
                      src={`/api/media/${comment.media[0].id}`} 
                      alt="Attachment" 
                      fill
                      className="border border-gray-200 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      sizes="(max-width: 768px) 100vw, 320px"
                      unoptimized={true}
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
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden focus-within:border-brand-primary focus-within:shadow-[0_0_15px_rgba(255,115,36,0.15)] transition-all duration-300 shadow-sm">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-transparent text-gray-900 placeholder:text-gray-400 p-4 min-h-[100px] outline-none resize-y"
            disabled={isSubmitting}
          />
          
          {file && (
            <div className="px-4 pb-2">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 pr-2">
                <ImageIcon className="w-4 h-4 text-brand-primary" />
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200">
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
              className="text-gray-400 hover:text-brand-primary transition-colors flex items-center gap-2 text-sm font-medium"
              disabled={isSubmitting}
            >
              <ImageIcon className="w-4 h-4" />
              Attach Screenshot
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || (!body.trim() && !file)}
              className="bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-1.5 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
