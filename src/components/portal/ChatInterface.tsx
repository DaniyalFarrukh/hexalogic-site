'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import { Send, User } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { postMessage } from '@/app/portal/(authenticated)/[slug]/actions'
import { createClient } from '@/lib/supabase/client'

export type MessageType = {
  id: string
  body: string
  created_at: string
  sender_id: string
  sender?: {
    full_name: string | null
    avatar_url: string | null
    role: string | null
  } | null
}

type Profile = { id: string; full_name: string | null; avatar_url: string | null; role: string | null }

function dayLabel(date: Date) {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  if (sameDay(date, today)) return 'Today'
  if (sameDay(date, yesterday)) return 'Yesterday'
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined })
}

export default function ChatInterface({
  projectId,
  initialMessages
}: {
  projectId: string
  initialMessages: MessageType[]
}) {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const currentUserRef = useRef<Profile | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll the message pane (not the page) to the newest message.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

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
    const channel = supabase.channel(`messages-${projectId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
        async (payload) => {
          const row = payload.new as { id: string; body: string; created_at: string; sender_id: string }
          // Our own messages are added optimistically when sent.
          if (currentUserRef.current && row.sender_id === currentUserRef.current.id) return

          const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url, role').eq('id', row.sender_id).single()
          const newMsg: MessageType = {
            id: row.id,
            body: row.body,
            created_at: row.created_at,
            sender_id: row.sender_id,
            sender: profile || undefined
          }
          setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setIsSubmitting(true)
    const currentBody = body
    setBody('')

    const optimisticId = `optimistic-${Date.now()}`
    if (currentUser) {
      setMessages(prev => [...prev, {
        id: optimisticId,
        body: currentBody,
        created_at: new Date().toISOString(),
        sender_id: currentUser.id,
        sender: { full_name: currentUser.full_name, avatar_url: currentUser.avatar_url, role: currentUser.role }
      }])
    }

    const result = await postMessage(projectId, currentBody)

    if (result?.error) {
      setMessages(prev => prev.filter(m => m.id !== optimisticId))
      setBody(currentBody)
      toast.error(result.error)
    } else if (result.messageId) {
      setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, id: result.messageId as string } : m))
    }

    setIsSubmitting(false)
  }

  let lastDay = ''

  return (
    <div className="flex flex-col h-[calc(100dvh-16rem)] min-h-[420px] md:h-[600px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5" aria-live="polite">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-sm text-center px-6">
            No messages yet. Say hello to start the conversation.
          </div>
        ) : (
          messages.map(msg => {
            const date = new Date(msg.created_at)
            const label = dayLabel(date)
            const showDay = label !== lastDay
            lastDay = label
            const isOwn = currentUser ? msg.sender_id === currentUser.id : false

            return (
              <Fragment key={msg.id}>
                {showDay && (
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span>{label}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
                <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {msg.sender?.avatar_url ? (
                      <Image src={msg.sender.avatar_url} alt="" width={36} height={36} className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <User className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    )}
                  </div>

                  <div className={`max-w-[80%] sm:max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      {!isOwn && (
                        <span className="text-sm font-medium text-gray-700">
                          {msg.sender?.full_name || 'Unknown User'}
                          {msg.sender?.role === 'admin' && (
                            <span className="ml-2 text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase">HexaLogic</span>
                          )}
                        </span>
                      )}
                      <time dateTime={msg.created_at} className="text-xs text-gray-400">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-sm leading-relaxed text-left break-words whitespace-pre-wrap ${
                      isOwn
                        ? 'bg-brand-primary text-white rounded-tr-none'
                        : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-none'
                    } ${msg.id.startsWith('optimistic-') ? 'opacity-70' : ''}`}>
                      {msg.body}
                    </div>
                  </div>
                </div>
              </Fragment>
            )
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
        <div className="relative flex items-center">
          <label htmlFor="chat-message" className="sr-only">Type your message</label>
          <input
            id="chat-message"
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            maxLength={4000}
            autoComplete="off"
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-full py-3.5 pl-5 pr-14 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-400"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !body.trim()}
            aria-label="Send message"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-[#ff8947] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  )
}
