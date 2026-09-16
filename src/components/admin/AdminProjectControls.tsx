'use client'

import { useState } from 'react'
import { updateProjectDetails, removeClientAccess } from '@/app/admin/admin-actions'

export default function AdminProjectControls({ 
  project, 
  profileId 
}: { 
  project: any,
  profileId?: string
}) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(project.status)
  const [progress, setProgress] = useState(project.progress)
  const [startDate, setStartDate] = useState(project.start_date || '')
  const [dueDate, setDueDate] = useState(project.due_date || '')

  const handleSave = async () => {
    setLoading(true)
    const res = await updateProjectDetails(project.id, {
      status,
      progress: parseInt(progress),
      start_date: startDate || null,
      due_date: dueDate || null
    })
    
    if (res?.error) {
      alert(res.error)
    }
    setLoading(false)
  }

  const handleRevoke = async () => {
    if (!profileId) return
    if (confirm("Are you sure you want to revoke the client's access? They will no longer be able to view this project.")) {
      setLoading(true)
      const res = await removeClientAccess(project.id, profileId)
      if (res?.error) alert(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Project Controls</h2>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-white border border-gray-200 text-gray-900 px-4 py-1.5 text-xs font-bold rounded hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
          <select 
            value={status} 
            onChange={e => setStatus(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
          >
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Progress ({progress}%)</label>
          <input 
            type="number" 
            min="0" 
            max="100"
            value={progress}
            onChange={e => setProgress(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Start Date</label>
          <input 
            type="date" 
            value={startDate.split('T')[0]}
            onChange={e => setStartDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Due Date</label>
          <input 
            type="date" 
            value={dueDate.split('T')[0]}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
          />
        </div>
      </div>

      {profileId && (
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            onClick={handleRevoke}
            disabled={loading}
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
          >
            Revoke Client Access
          </button>
        </div>
      )}
    </div>
  )
}
