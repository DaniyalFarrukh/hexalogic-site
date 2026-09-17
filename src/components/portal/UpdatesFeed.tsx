'use client'

import { useState, useEffect } from 'react'
import LocalTime from './LocalTime'
import { fetchMoreUpdates } from '@/app/portal/portal-actions'
import { softDeleteUpdate } from '@/app/admin/admin-actions'
import Image from 'next/image'
import { CommentSection } from '@/app/portal/[slug]/components/CommentSection'

export default function UpdatesFeed({ 
  initialUpdates, 
  projectId,
  isAdmin = false
}: { 
  initialUpdates: any[], 
  projectId: string,
  isAdmin?: boolean
}) {
  const [updates, setUpdates] = useState(initialUpdates)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialUpdates.length === 10)

  useEffect(() => {
    setUpdates(initialUpdates)
    setHasMore(initialUpdates.length === 10)
  }, [initialUpdates])

  const handleLoadMore = async () => {
    if (updates.length === 0) return
    setLoading(true)
    
    // Cursor is the created_at of the last update
    const lastUpdate = updates[updates.length - 1]
    const nextUpdates = await fetchMoreUpdates(projectId, lastUpdate.created_at)
    
    if (nextUpdates.length > 0) {
      setUpdates([...updates, ...nextUpdates])
    }
    
    setHasMore(nextUpdates.length === 10)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return
    const res = await softDeleteUpdate(id)
    if (res.error) alert(res.error)
    else setUpdates(updates.filter(u => u.id !== id))
  }

  if (updates.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Updates</h2>
        <div className="text-gray-500 text-sm">
          Your project team hasn't posted any updates yet. You'll see weekly progress reports, attachments, and communication logged here as work begins.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 relative shadow-sm">
      <div className="space-y-8">
        {updates.map((u) => (
          <div key={u.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 relative hover:-translate-y-1 hover:shadow-lg hover:border-gray-300 transition-all duration-300">
            {isAdmin && (
              <button 
                onClick={() => handleDelete(u.id)}
                className="absolute top-6 right-6 text-gray-500 hover:text-red-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mt-2 -mr-2"
                title="Delete Update"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                {u.author?.avatar_url ? (
                  <Image 
                    src={u.author.avatar_url} 
                    alt={u.author.full_name || 'Author'} 
                    width={32} 
                    height={32} 
                    className="rounded-full bg-gray-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                    {(u.author?.full_name || 'U')[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 pr-10">{u.title}</h3>
                  <div className="text-[10px] text-gray-500 font-medium">
                    {u.author?.full_name || 'Team Member'}
                  </div>
                </div>
              </div>
              <div className="text-right mt-1 sm:mt-0 mr-8 sm:mr-10">
                <div className="text-xs text-gray-400 font-medium">
                  <LocalTime utcString={u.created_at} />
                </div>
                {u.hours > 0 && (
                  <div className="text-[10px] font-bold text-brand-primary mt-1 uppercase tracking-widest">
                    +{u.hours} hrs
                  </div>
                )}
              </div>
            </div>

            <div className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap break-words overflow-hidden">
              {u.body}
            </div>

            {u.media && u.media.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                {u.media.map((m: any) => (
                  <a 
                    key={m.id} 
                    href={`/api/media/${m.id}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="block relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-brand-primary/50 transition-colors group bg-gray-100"
                  >
                    {m.kind === 'image' ? (
                      <Image 
                        src={`/api/media/${m.id}`} 
                        alt={m.caption || 'Attached image'} 
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        sizes="80px"
                        unoptimized={true}
                      />
                    ) : m.kind === 'video' ? (
                      <div className="flex items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-primary transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-primary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                    )}
                  </a>
                ))}
              </div>
            )}
            
            <CommentSection 
              projectId={projectId}
              targetType="update"
              targetId={u.id}
              comments={u.comments || []}
            />
          </div>
        ))}
      </div>
    </div>

      {hasMore && (
        <button 
          onClick={handleLoadMore} 
          disabled={loading}
          className="w-full py-4 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-900 hover:border-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
             <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          ) : 'Load More Updates'}
        </button>
      )}
    </div>
  )
}
