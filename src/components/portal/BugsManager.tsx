'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { addBug, updateBugStatus, updateBugSeverity, deleteBug, type BugSeverity, type BugStatus } from '@/app/portal/(authenticated)/[slug]/bugs/actions'
import LocalTime from './LocalTime'

export type Bug = {
  id: string
  title: string
  description: string | null
  status: BugStatus | string
  severity: BugSeverity | string
  created_at: string
  reporter?: { full_name: string | null } | null
}

const statusColors: Record<string, string> = {
  open: 'bg-red-50 text-red-700 border-red-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
}

const severityColors: Record<string, string> = {
  low: 'text-gray-600 bg-gray-100',
  medium: 'text-blue-700 bg-blue-50',
  high: 'text-orange-700 bg-orange-50',
  critical: 'text-red-700 bg-red-50'
}

const inputClass = 'w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary bg-white'

export default function BugsManager({ bugs, projectId, isAdmin }: { bugs: Bug[]; projectId: string; isAdmin?: boolean }) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'medium' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await addBug(projectId, formData)
    setIsSubmitting(false)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Issue reported. The team has been notified.')
    setIsAdding(false)
    setFormData({ title: '', description: '', severity: 'medium' })
    router.refresh()
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateBugStatus(id, newStatus)
    if (res?.error) toast.error(res.error)
    else router.refresh()
  }

  const handleSeverityChange = async (id: string, newSeverity: string) => {
    const res = await updateBugSeverity(id, newSeverity)
    if (res?.error) toast.error(res.error)
    else router.refresh()
  }

  const handleDelete = async (id: string) => {
    const res = await deleteBug(id)
    setPendingDelete(null)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Issue deleted')
    router.refresh()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Issue Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">Report bugs or issues you find in the application.</p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-brand-secondary text-white px-4 py-2 min-h-[44px] rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            Report Issue
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <h3 className="font-bold text-gray-900">Report a New Issue</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="bug-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input id="bug-title" required maxLength={200} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} placeholder="Brief summary of the issue" />
            </div>
            <div>
              <label htmlFor="bug-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="bug-description" required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputClass} rows={4} placeholder="Steps to reproduce, expected vs actual behavior..." />
            </div>
            <div>
              <label htmlFor="bug-severity" className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select id="bug-severity" value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })} className={inputClass}>
                <option value="low">Low (minor visual issue, does not affect functionality)</option>
                <option value="medium">Medium (annoyance, workaround available)</option>
                <option value="high">High (core feature broken, no workaround)</option>
                <option value="critical">Critical (app crashing, data loss)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setFormData({ title: '', description: '', severity: 'medium' }) }} className="px-4 py-2 min-h-[44px] text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 min-h-[44px] bg-brand-secondary text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] disabled:opacity-50 transition-colors">
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      )}

      {(!bugs || bugs.length === 0) && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" aria-hidden="true" />
          <p>No open issues. Nice and clean.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map(bug => (
            <div key={bug.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg break-words">{bug.title}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full border ${statusColors[bug.status] || statusColors.open}`}>
                    {bug.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${severityColors[bug.severity] || severityColors.medium}`}>
                    {bug.severity}
                  </span>
                </div>
                {bug.description && <p className="text-gray-600 text-sm whitespace-pre-wrap break-words">{bug.description}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 font-medium">
                  <span>Reported by <span className="text-gray-700">{bug.reporter?.full_name || 'Unknown'}</span></span>
                  <LocalTime utcString={bug.created_at} formatOptions={{ dateStyle: 'medium', timeStyle: 'short' }} />
                </div>
              </div>

              {isAdmin && (
                <div className="flex flex-row md:flex-col flex-wrap gap-2 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <label className="sr-only" htmlFor={`status-${bug.id}`}>Status</label>
                  <select
                    id={`status-${bug.id}`}
                    value={bug.status}
                    onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                    className="text-sm font-semibold border border-gray-200 rounded-lg p-2 min-h-[40px] bg-white focus:ring-brand-secondary focus:border-brand-secondary"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <label className="sr-only" htmlFor={`severity-${bug.id}`}>Severity</label>
                  <select
                    id={`severity-${bug.id}`}
                    value={bug.severity}
                    onChange={(e) => handleSeverityChange(bug.id, e.target.value)}
                    className="text-sm font-semibold border border-gray-200 rounded-lg p-2 min-h-[40px] bg-white focus:ring-brand-secondary focus:border-brand-secondary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  {pendingDelete === bug.id ? (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setPendingDelete(null)} className="px-3 py-2 min-h-[40px] text-xs font-bold text-gray-600 hover:text-gray-900">Cancel</button>
                      <button type="button" onClick={() => handleDelete(bug.id)} className="px-3 py-2 min-h-[40px] text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg">Confirm delete</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setPendingDelete(bug.id)} className="px-3 py-2 min-h-[40px] text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
