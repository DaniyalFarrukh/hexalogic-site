'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'
import Link from 'next/link'

function formatDistanceToNow(date: Date, options: { addSuffix?: boolean } = {}) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years' + (options.addSuffix ? ' ago' : '')
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months' + (options.addSuffix ? ' ago' : '')
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days' + (options.addSuffix ? ' ago' : '')
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours' + (options.addSuffix ? ' ago' : '')
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes' + (options.addSuffix ? ' ago' : '')
  
  return Math.floor(seconds) + ' seconds' + (options.addSuffix ? ' ago' : '')
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch recent activity for projects this user is a member of
      const { data, error } = await supabase
        .from('activity_log')
        .select(`
          id, event_type, payload, created_at,
          projects!inner (slug, title),
          profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setNotifications(data)
        const lastReadStr = localStorage.getItem('hexalogic_last_read_notifications')
        const lastRead = lastReadStr ? new Date(lastReadStr) : new Date(Date.now() - 24 * 60 * 60 * 1000)
        
        const recent = data.filter(n => new Date(n.created_at) > lastRead)
        setUnreadCount(recent.length)
      }
    }

    fetchNotifications()

    // Subscribe to new activity
    const channel = supabase.channel('client-activity')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        fetchNotifications()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && payload.new.sender_id !== user.id) {
          fetchNotifications()
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const formatEvent = (n: any) => {
    const actor = n.profiles?.full_name || 'System'
    switch (n.event_type) {
      case 'project_created': return `Project was created.`
      case 'milestone_created': return `${actor} added a new milestone.`
      case 'milestone_updated': return `${actor} updated a milestone.`
      case 'project_updated': return `${actor} updated the project status.`
      case 'comment_added': return `${actor} left a new comment.`
      case 'message_sent': return `${actor} sent a new message.`
      default: return `New activity recorded.`
    }
  }

  const handleToggleDropdown = () => {
    if (!isOpen) {
      // User is opening the dropdown, so mark everything up to now as read
      localStorage.setItem('hexalogic_last_read_notifications', new Date().toISOString())
      setUnreadCount(0)
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggleDropdown}
        className="p-2 text-gray-500 hover:text-gray-900 transition-colors relative"
      >
        {unreadCount > 0 && (
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        )}
        <Bell className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>
          
          <div className="h-[280px] overflow-y-scroll pr-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No recent notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <Link 
                    key={n.id}
                    href={`/portal/${n.projects.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary group-hover:scale-150 transition-transform"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium mb-1.5 leading-snug">
                          {formatEvent(n)}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="truncate mr-3 font-medium text-brand-secondary/80">{n.projects.title}</span>
                          <span className="flex-shrink-0 whitespace-nowrap">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
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
