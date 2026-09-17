'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { approveMilestoneAction } from '@/app/portal/(authenticated)/[slug]/actions'

export default function MilestoneActions({
  milestoneId,
  status,
  approvalStatus
}: {
  milestoneId: string
  status: string
  approvalStatus: string | null
}) {
  const [loading, setLoading] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [note, setNote] = useState('')
  const router = useRouter()

  if (approvalStatus === 'approved') {
    return <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Approved</span>
  }
  if (approvalStatus === 'changes_requested') {
    return <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Changes requested</span>
  }
  if (status !== 'done') return null

  const handleApprove = async () => {
    setLoading(true)
    const res = await approveMilestoneAction(milestoneId, 'approved')
    setLoading(false)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Milestone approved')
    router.refresh()
  }

  const handleRequestChanges = async () => {
    if (!note.trim()) return
    setLoading(true)
    const res = await approveMilestoneAction(milestoneId, 'changes_requested', note)
    setLoading(false)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Your change request was sent to the team')
    setShowNote(false)
    router.refresh()
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <p className="text-xs text-gray-500 mb-3">This milestone is marked as done. Please review the work and let the team know.</p>
      {!showNote ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleApprove}
            disabled={loading}
            className="bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold uppercase tracking-wider py-2 px-4 min-h-[40px] rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => setShowNote(true)}
            disabled={loading}
            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-xs font-bold uppercase tracking-wider py-2 px-4 min-h-[40px] rounded-lg transition-colors disabled:opacity-50"
          >
            Request Changes
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor={`note-${milestoneId}`} className="sr-only">What needs to be changed?</label>
          <textarea
            id={`note-${milestoneId}`}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What needs to be changed?"
            className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
            rows={3}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRequestChanges}
              disabled={loading || !note.trim()}
              className="bg-brand-primary hover:bg-[#ff8947] text-white text-xs font-bold uppercase tracking-wider py-2 px-4 min-h-[40px] rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowNote(false)}
              disabled={loading}
              className="text-gray-500 hover:text-gray-900 text-xs font-medium px-3 min-h-[40px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
