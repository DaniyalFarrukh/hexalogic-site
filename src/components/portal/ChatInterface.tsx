'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, User } from 'lucide-react'
import { postMessage } from '@/app/portal/[slug]/actions'
import { createClient } from '@/lib/supabase/client'

export type MessageType = {
  id: string
  body: string
  created_at: string
  sender_id: string
  sender?: {
    full_name: string
    avatar_url: string | null
    role: string
  }
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
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fetch current user
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setCurrentUserProfile({ ...data, id: user.id })
      }
    })
  }, [supabase])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase.channel(`messages-${projectId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` },
        async (payload) => {
          // Prevent duplicates if it's our own message we just added optimistically
          // The optimistic UI creates an ID starting with 'optimistic-'
          if (currentUserProfile && payload.new.sender_id !== currentUserProfile.id) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', payload.new.sender_id).single()
            
            const newMsg: MessageType = {
              id: payload.new.id,
              body: payload.new.body,
              created_at: payload.new.created_at,
              sender_id: payload.new.sender_id,
              sender: profile ? {
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                role: profile.role
              } : undefined
            }
            
            setMessages(prev => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase, projectId, currentUserProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    setIsSubmitting(true)
    const currentBody = body
    setBody('')

    // Optimistic Update
    if (currentUserProfile) {
      const optimisticMessage: MessageType = {
        id: `optimistic-${Date.now()}`,
        body: currentBody,
        created_at: new Date().toISOString(),
        sender_id: currentUserProfile.id,
        sender: {
          full_name: currentUserProfile.full_name,
          avatar_url: currentUserProfile.avatar_url,
          role: currentUserProfile.role,
        }
      }
      setMessages(prev => [...prev, optimisticMessage])
    }

    const result = await postMessage(projectId, currentBody)
    
    if (result?.error) {
      // Revert if error
      setMessages(prev => prev.filter(m => !m.id.startsWith('optimistic-')))
      setBody(currentBody)
    } else if (result.messageId) {
      // Update the optimistic message's ID with the real one
      setMessages(prev => prev.map(m => m.id.startsWith('optimistic-') ? { ...m, id: result.messageId } : m))
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] min-h-[400px] md:h-[600px] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map(msg => {
            const isOwn = currentUserProfile && msg.sender_id === currentUserProfile.id
            return (
              <div key={msg.id} className={`flex gap-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {msg.sender?.avatar_url ? (
                    <img src={msg.sender.avatar_url} alt={msg.sender?.full_name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[75%] ${isOwn ? 'items-end text-right' : 'items-start text-left'}`}>
                  <div className="flex items-baseline gap-2 mb-1 justify-end">
                    <span className="text-xs text-gray-500">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {!isOwn && (
                      <span className="text-sm font-medium text-gray-700">
                        {msg.sender?.full_name || 'Unknown User'}
                        {msg.sender?.role === 'admin' && (
                          <span className="ml-2 text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                        )}
                      </span>
                    )}
                  </div>
                  
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed inline-block text-left break-words ${
                    isOwn 
                      ? 'bg-brand-primary text-white rounded-tr-none shadow-[0_0_15px_rgba(255,115,36,0.15)]' 
                      : 'bg-gray-100 border border-gray-200 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.body}
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-gray-400"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !body.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-[#ff8947] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  )
}
