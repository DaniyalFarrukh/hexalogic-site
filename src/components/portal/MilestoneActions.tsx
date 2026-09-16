'use client'

import { useState } from 'react'
import { approveMilestoneAction } from '@/app/portal/[slug]/actions'
import { useRouter } from 'next/navigation'

export default function MilestoneActions({ milestoneId, status, approvalStatus }: { milestoneId: string, status: string, approvalStatus: string }) {
  const [loading, setLoading] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState('')
  const router = useRouter()

  if (status !== 'done' || approvalStatus !== 'none') {
    if (approvalStatus === 'approved') return <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">Approved</span>
    if (approvalStatus === 'changes_requested') return <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">Changes Requested</span>
    return null
  }

  const handleApprove = async () => {
    setLoading(true)
    await approveMilestoneAction(milestoneId, 'approved')
    setLoading(false)
    router.refresh()
  }

  const handleRequestChanges = async () => {
    if (!note.trim()) return
    setLoading(true)
    await approveMilestoneAction(milestoneId, 'changes_requested', note)
    setShowNote(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/5">
      {!showNote ? (
        <div className="flex gap-2">
          <button 
            onClick={handleApprove}
            disabled={loading}
            className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
          <button 
            onClick={() => setShowNote(true)}
            disabled={loading}
            className="bg-transparent border border-white/10/40 hover:border-white/10 hover:text-white text-gray-400 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition-colors disabled:opacity-50"
          >
            Request Changes
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea 
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What needs to be changed?"
            className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-brand-primary outline-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button 
              onClick={handleRequestChanges}
              disabled={loading || !note.trim()}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded transition-colors disabled:opacity-50"
            >
              Submit Request
            </button>
            <button 
              onClick={() => setShowNote(false)}
              disabled={loading}
              className="text-gray-400 hover:text-white text-xs font-medium px-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
