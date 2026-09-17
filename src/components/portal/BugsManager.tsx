'use client'

import { useState } from 'react'
import { addBug, updateBugStatus, updateBugSeverity, deleteBug } from '@/app/portal/[slug]/bugs/actions'
import { useRouter } from 'next/navigation'
import LocalTime from './LocalTime'

export default function BugsManager({ bugs, projectId, isAdmin }: { bugs: any[], projectId: string, isAdmin?: boolean }) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', severity: 'medium' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await addBug(projectId, formData)
      setIsAdding(false)
      setFormData({ title: '', description: '', severity: 'medium' })
      router.refresh()
    } catch (err) {
      alert('An error occurred while reporting the bug.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateBugStatus(id, newStatus)
      router.refresh()
    } catch (err) {
      alert('Update failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bug?')) return
    try {
      await deleteBug(id)
      router.refresh()
    } catch (err) {
      alert('Delete failed')
    }
  }

  const statusColors: Record<string, string> = {
    open: 'bg-red-50 text-red-600 border-red-200',
    in_progress: 'bg-amber-50 text-amber-600 border-amber-200',
    resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  }

  const severityColors: Record<string, string> = {
    low: 'text-gray-500 bg-gray-100',
    medium: 'text-blue-600 bg-blue-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Issue Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">Report bugs or issues encountered in the application.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[#ff8947] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Report Issue
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <h3 className="font-bold text-gray-900">Report a New Issue</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" placeholder="Brief summary of the issue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" rows={4} placeholder="Steps to reproduce, expected vs actual behavior..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary bg-white">
                <option value="low">Low (Minor visual issue, doesn't affect functionality)</option>
                <option value="medium">Medium (Annoyance, workaround available)</option>
                <option value="high">High (Core feature broken, no workaround)</option>
                <option value="critical">Critical (App crashing, data loss)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setFormData({ title: '', description: '', severity: 'medium' }) }} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-brand-secondary text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] disabled:opacity-50 transition-colors">
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>
      )}

      {(!bugs || bugs.length === 0) && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>Hooray! No bugs reported.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bugs.map(bug => (
            <div key={bug.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{bug.title}</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full border ${statusColors[bug.status]}`}>
                    {bug.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${severityColors[bug.severity]}`}>
                    {bug.severity}
                  </span>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{bug.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Reported by</span>
                    <span className="text-gray-700">{bug.reporter?.full_name || 'Unknown'}</span>
                  </div>
                  <span>•</span>
                  <LocalTime utcString={bug.created_at} />
                </div>
              </div>
              
              {isAdmin && (
                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <select 
                    value={bug.status} 
                    onChange={(e) => handleStatusChange(bug.id, e.target.value)}
                    className="text-sm font-semibold border border-gray-200 rounded-lg p-2 focus:ring-brand-secondary focus:border-brand-secondary"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button onClick={() => handleDelete(bug.id)} className="px-3 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
