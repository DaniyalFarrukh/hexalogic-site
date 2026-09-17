'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { describeActivity, timeAgo } from '@/lib/activity'

type Notification = {
  id: string
  event_type: string
  payload: Record<string, unknown> | null
  created_at: string
  projects: { slug: string; title: string } | null
  profiles: { full_name: string | null } | null
}

const STORAGE_KEY = 'hexalogic_last_read_notifications'

function readLastSeen() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? new Date(stored) : new Date(Date.now() - 24 * 60 * 60 * 1000)
  } catch {
    return new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
}

export default function NotificationsDropdown({ mode = 'client' }: { mode?: 'admin' | 'client' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const basePath = mode === 'admin' ? '/admin' : '/portal'

  const fetchNotifications = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('activity_log')
      .select('id, event_type, payload, created_at, projects!inner (slug, title), profiles (full_name)')
      .neq('actor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) {
      const rows = data as unknown as Notification[]
      setNotifications(rows)
      const lastSeen = readLastSeen()
      setUnreadCount(rows.filter(n => new Date(n.created_at) > lastSeen).length)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  useEffect(() => {
    // Defer the initial load so state updates never run synchronously inside the effect body.
    queueMicrotask(() => { void fetchNotifications() })

    const supabase = createClient()
    const channel = supabase.channel('activity-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        fetchNotifications()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNotifications])

  const handleToggleDropdown = () => {
    if (!isOpen) {
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString())
      } catch {
        // storage unavailable
      }
      setUnreadCount(0)
    }
    setIsOpen(!isOpen)
  }

  const linkFor = (n: Notification) => {
    if (!n.projects) return basePath
    const base = `${basePath}/${n.projects.slug}`
    switch (n.event_type) {
      case 'message_sent':
        return `${base}/messages`
      case 'file_uploaded':
        return `${base}/files`
      case 'comment_added': {
        const target = n.payload && typeof n.payload.target_type === 'string' ? n.payload.target_type : ''
        return target === 'milestone' ? `${base}/milestones` : `${base}/updates`
      }
      case 'approval_given':
      case 'milestone_approved':
      case 'milestone_changes_requested':
      case 'milestone_updated':
        return `${base}/milestones`
      case 'update_published':
        return `${base}/updates`
      default:
        return base
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} new` : 'Notifications'}
        className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative rounded-lg hover:bg-gray-100"
      >
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
        )}
        <Bell className="w-5 h-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No recent notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={linkFor(n)}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:scale-150 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium mb-1.5 leading-snug">
                          {describeActivity(n.event_type, n.profiles?.full_name, n.payload)}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500 gap-3">
                          <span className="truncate font-medium text-brand-secondary/80">{n.projects?.title}</span>
                          <span className="flex-shrink-0 whitespace-nowrap">{timeAgo(n.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
