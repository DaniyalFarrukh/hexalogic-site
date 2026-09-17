'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function AdminNotifications() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get current user to ensure we don't notify them of their own actions
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [supabase])

  useEffect(() => {
    if (!userId) return

    const channel = supabase.channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        async (payload) => {
          const comment = payload.new
          
          // Don't show toast for admin's own comments
          if (comment.author_id === userId) return

          // Fetch the project details to create a link and get the project name
          const { data: project } = await supabase
            .from('projects')
            .select('slug, title')
            .eq('id', comment.project_id)
            .single()

          // Fetch author name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', comment.author_id)
            .single()

          const authorName = profile?.full_name || 'A client'
          const projectName = project?.title || 'a project'
          
          toast(
            (t) => (
              <div className="flex flex-col gap-1">
                <span className="font-bold text-white">{authorName} commented</span>
                <span className="text-sm text-gray-300">&ldquo;{comment.body.substring(0, 50)}{comment.body.length > 50 ? '...' : ''}&rdquo;</span>
                {project && (
                  <Link 
                    href={`/admin/${project.slug}`} 
                    className="text-xs text-brand-primary hover:underline mt-1"
                    onClick={() => toast.dismiss(t.id)}
                  >
                    View in {projectName}
                  </Link>
                )}
              </div>
            ),
            {
              duration: 5000,
              position: 'bottom-right',
              style: {
                background: '#141417',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
              },
            }
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'milestones' },
        async (payload) => {
          const newMilestone = payload.new
          const oldMilestone = payload.old
          
          // Check if approval status changed and not by this admin (though approval status is usually changed by client)
          if (newMilestone.approval_status !== oldMilestone.approval_status) {
            const { data: project } = await supabase
              .from('projects')
              .select('slug, title')
              .eq('id', newMilestone.project_id)
              .single()

            const projectName = project?.title || 'a project'
            
            let actionText = ''
            if (newMilestone.approval_status === 'approved') actionText = 'approved a milestone'
            else if (newMilestone.approval_status === 'changes_requested') actionText = 'requested changes on a milestone'
            else return // don't notify for other changes
            
            toast(
              (t) => (
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white">Client {actionText}</span>
                  <span className="text-sm text-gray-300">{newMilestone.title}</span>
                  {project && (
                    <Link 
                      href={`/admin/${project.slug}`} 
                      className="text-xs text-brand-primary hover:underline mt-1"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      View in {projectName}
                    </Link>
                  )}
                </div>
              ),
              {
                duration: 5000,
                position: 'bottom-right',
                style: {
                  background: '#141417',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  borderLeft: newMilestone.approval_status === 'approved' ? '4px solid #10b981' : '4px solid #ef4444'
                },
              }
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  return null // This component only handles logic, no UI itself
}
