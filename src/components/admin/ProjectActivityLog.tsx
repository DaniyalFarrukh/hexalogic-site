'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ActivityItem = {
  id: string
  type: 'comment' | 'milestone_approved' | 'milestone_changes_requested' | string
  created_at: string
  actorName: string
  actorRole?: string
  body?: string
  targetName?: string // Optional context like which milestone
}

export default function ProjectActivityLog({
  projectId,
  initialActivities
}: {
  projectId: string
  initialActivities: ActivityItem[]
}) {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setActivities(initialActivities)
  }, [initialActivities])

  // Listen for real-time changes
  useEffect(() => {
    // When comments are added, refresh to get new activities
    const commentsChannel = supabase.channel(`activity-comments-${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `project_id=eq.${projectId}` }, () => {
        router.refresh()
      })
      .subscribe()

    // When activity_log is added (milestone updates), refresh
    const activityChannel = supabase.channel(`activity-log-${projectId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `project_id=eq.${projectId}` }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(commentsChannel)
      supabase.removeChannel(activityChannel)
    }
  }, [supabase, projectId, router])

  const renderIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400" />
      case 'milestone_approved': return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'milestone_changes_requested': return <AlertCircle className="w-4 h-4 text-rose-400" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="bg-surface-dark/90 border border-white/10 rounded-2xl flex flex-col h-[calc(100vh-10rem)] min-h-[800px] overflow-hidden sticky top-8 shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-black/40 flex-shrink-0">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Clock className="w-6 h-6 text-brand-primary" />
          Project Activity
        </h2>
        <p className="text-sm text-gray-400 mt-2">Recent messages and milestone actions.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {activities.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No activity yet.</p>
        ) : (
          activities.map((item) => (
            <div key={item.id} className="flex gap-4 items-start group">
              <div className="mt-1 bg-black/60 p-3 rounded-full border border-white/5 group-hover:border-white/20 group-hover:shadow-[0_0_15px_rgba(255,115,36,0.1)] transition-all">
                {renderIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0 bg-black/20 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-base text-gray-200">
                    {item.actorName}
                    {item.actorRole === 'admin' && <span className="ml-2 px-2 py-0.5 bg-brand-primary/10 rounded-full text-xs text-brand-primary font-bold tracking-wide">HexaLogic</span>}
                  </span>
                  <span className="text-xs text-gray-500 font-medium bg-black/40 px-2 py-1 rounded-md">
                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="text-base text-gray-300 mt-1 leading-relaxed">
                  {item.type === 'comment' && (
                    <span className="block whitespace-pre-wrap">"{item.body}"</span>
                  )}
                  {item.type === 'milestone_approved' && (
                    <span className="text-emerald-400 font-medium">Approved a milestone</span>
                  )}
                  {item.type === 'milestone_changes_requested' && (
                    <span className="text-rose-400 font-medium">Requested milestone changes</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
