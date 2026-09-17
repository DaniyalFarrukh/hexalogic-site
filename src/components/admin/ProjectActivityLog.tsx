'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, CheckCircle, AlertCircle, Clock, FileUp, Send, LogIn, Megaphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { describeActivity } from '@/lib/activity'

export type ActivityItem = {
  id: string
  type: 'comment' | string
  created_at: string
  actorName: string
  actorRole?: string
  body?: string
  payload?: Record<string, unknown> | null
}

function iconFor(type: string) {
  switch (type) {
    case 'comment':
    case 'comment_added':
      return <MessageSquare className="w-4 h-4 text-blue-600" />
    case 'milestone_approved':
      return <CheckCircle className="w-4 h-4 text-emerald-600" />
    case 'milestone_changes_requested':
      return <AlertCircle className="w-4 h-4 text-rose-600" />
    case 'approval_given':
      return <CheckCircle className="w-4 h-4 text-emerald-600" />
    case 'file_uploaded':
      return <FileUp className="w-4 h-4 text-violet-600" />
    case 'message_sent':
      return <Send className="w-4 h-4 text-brand-primary" />
    case 'client_logged_in':
      return <LogIn className="w-4 h-4 text-gray-500" />
    case 'update_published':
      return <Megaphone className="w-4 h-4 text-brand-primary" />
    default:
      return <Clock className="w-4 h-4 text-gray-400" />
  }
}

export default function ProjectActivityLog({
  projectId,
  initialActivities
}: {
  projectId: string
  initialActivities: ActivityItem[]
}) {
  const router = useRouter()

  // Refresh the server-rendered list whenever new comments or activity arrive.
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel(`activity-${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `project_id=eq.${projectId}` }, () => {
        router.refresh()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `project_id=eq.${projectId}` }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, router])

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/60">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <Clock className="w-5 h-5 text-brand-primary" />
          Project Activity
        </h2>
        <p className="text-sm text-gray-500 mt-1">Comments, messages, uploads and milestone decisions, newest first.</p>
      </div>

      <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
        {initialActivities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No activity yet.</p>
        ) : (
          initialActivities.map((item) => {
            const date = new Date(item.created_at)
            return (
              <div key={item.id} className="flex gap-3 sm:gap-4 items-start">
                <div className="mt-0.5 bg-gray-50 p-2.5 rounded-full border border-gray-200 shrink-0">
                  {iconFor(item.type)}
                </div>
                <div className="flex-1 min-w-0 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {item.actorName}
                      {item.actorRole === 'admin' && (
                        <span className="ml-2 px-2 py-0.5 bg-brand-primary/10 rounded-full text-[10px] text-brand-primary font-bold tracking-wide uppercase">HexaLogic</span>
                      )}
                    </span>
                    <time dateTime={item.created_at} className="text-xs text-gray-500 font-medium">
                      {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {item.type === 'comment' ? (
                      <span className="block whitespace-pre-wrap break-words">&ldquo;{item.body}&rdquo;</span>
                    ) : (
                      describeActivity(item.type, item.actorName, item.payload)
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
