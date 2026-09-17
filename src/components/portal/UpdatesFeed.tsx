'use client'

import { useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Trash2, PlayCircle, Paperclip, ExternalLink } from 'lucide-react'
import LocalTime from './LocalTime'
import { fetchMoreUpdates } from '@/app/portal/portal-actions'
import { softDeleteUpdate } from '@/app/admin/admin-actions'
import { CommentSection, type CommentType } from '@/app/portal/(authenticated)/[slug]/components/CommentSection'
import { isExternalPath } from '@/lib/media'

export type UpdateMedia = {
  id: string
  path: string
  kind: string
  caption?: string | null
}

export type ProjectUpdate = {
  id: string
  title: string
  body: string
  hours?: number | null
  created_at: string
  author?: { full_name: string | null; avatar_url: string | null } | null
  media?: UpdateMedia[]
  comments?: CommentType[]
}

const PAGE_SIZE = 10

export default function UpdatesFeed({
  initialUpdates,
  projectId,
  isAdmin = false
}: {
  initialUpdates: ProjectUpdate[]
  projectId: string
  isAdmin?: boolean
}) {
  // Extra pages loaded on the client and updates removed by the admin.
  const [extraUpdates, setExtraUpdates] = useState<ProjectUpdate[]>([])
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialUpdates.length === PAGE_SIZE)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const seen = new Set<string>()
  const updates = [...initialUpdates, ...extraUpdates].filter(u => {
    if (removedIds.has(u.id) || seen.has(u.id)) return false
    seen.add(u.id)
    return true
  })

  const handleLoadMore = async () => {
    if (updates.length === 0) return
    setLoading(true)
    const lastUpdate = updates[updates.length - 1]
    const nextUpdates = (await fetchMoreUpdates(projectId, lastUpdate.created_at)) as ProjectUpdate[]
    if (nextUpdates.length > 0) setExtraUpdates(prev => [...prev, ...nextUpdates])
    setHasMore(nextUpdates.length === PAGE_SIZE)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    const res = await softDeleteUpdate(id)
    setConfirmDeleteId(null)
    if (res.error) {
      toast.error(res.error)
      return
    }
    setRemovedIds(prev => new Set(prev).add(id))
    toast.success('Update deleted')
  }

  if (updates.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Updates</h2>
        <div className="text-gray-500 text-sm">
          The project team has not posted any updates yet. Progress reports, attachments and notes will appear here as work begins.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {updates.map((u) => (
          <article key={u.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 relative hover:border-gray-300 transition-colors">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3 min-w-0">
                {u.author?.avatar_url ? (
                  <Image
                    src={u.author.avatar_url}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full bg-gray-100 shrink-0"
                    unoptimized
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
                    {(u.author?.full_name || 'H')[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 break-words">{u.title}</h3>
                  <div className="text-xs text-gray-500 font-medium">
                    {u.author?.full_name || 'HexaLogic Team'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                <div className="text-xs text-gray-500 font-medium">
                  <LocalTime utcString={u.created_at} formatOptions={{ dateStyle: 'medium', timeStyle: 'short' }} />
                </div>
                {u.hours && u.hours > 0 ? (
                  <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                    +{u.hours} hrs logged
                  </div>
                ) : null}
                {isAdmin && (
                  confirmDeleteId === u.id ? (
                    <div className="flex items-center gap-2 text-xs">
                      <button type="button" onClick={() => setConfirmDeleteId(null)} className="font-bold text-gray-600 hover:text-gray-900">Cancel</button>
                      <button type="button" onClick={() => handleDelete(u.id)} className="font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded">Delete</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(u.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-red-50"
                      title="Delete update"
                      aria-label={`Delete update ${u.title}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )
                )}
              </div>
            </header>

            <div className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap break-words">
              {u.body}
            </div>

            {u.media && u.media.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                {u.media.map((m) => {
                  const external = isExternalPath(m.path)
                  const href = external ? m.path : `/api/media/${m.id}`
                  return (
                    <a
                      key={m.id}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="block relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-brand-primary/50 transition-colors group bg-gray-100"
                      title={m.caption || (external ? m.path : m.kind)}
                    >
                      {m.kind === 'image' && !external ? (
                        <Image
                          src={href}
                          alt={m.caption || 'Attached image'}
                          fill
                          className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          sizes="80px"
                          unoptimized
                        />
                      ) : m.kind === 'video' ? (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-primary transition-colors">
                          <PlayCircle className="w-6 h-6" aria-hidden="true" />
                          {external && <ExternalLink className="w-3 h-3 mt-1" aria-hidden="true" />}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 group-hover:text-brand-primary transition-colors">
                          <Paperclip className="w-6 h-6" aria-hidden="true" />
                          {external && <ExternalLink className="w-3 h-3 mt-1" aria-hidden="true" />}
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
            )}

            <CommentSection
              projectId={projectId}
              targetType="update"
              targetId={u.id}
              comments={u.comments || []}
            />
          </article>
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
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
