'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { updateProjectDetails, removeClientAccess, type ProjectDetailsInput } from '@/app/admin/admin-actions'
import { PROJECT_STATUS_OPTIONS, type ProjectStatus } from '@/lib/status'

const inputClass =
  'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 transition-colors shadow-sm'
const labelClass = 'text-[10px] font-bold text-gray-500 uppercase tracking-widest'

function dateOnly(value?: string | null) {
  return value ? value.split('T')[0] : ''
}

export default function AdminProjectControls({
  project,
  clientProfileId,
  clientName,
}: {
  project: {
    id: string
    title: string
    description?: string | null
    status: string
    progress: number
    start_date?: string | null
    due_date?: string | null
  }
  clientProfileId?: string
  clientName?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description || '')
  const [status, setStatus] = useState<ProjectStatus>(project.status as ProjectStatus)
  const [progress, setProgress] = useState(String(project.progress))
  const [startDate, setStartDate] = useState(dateOnly(project.start_date))
  const [dueDate, setDueDate] = useState(dateOnly(project.due_date))
  const [confirmRevoke, setConfirmRevoke] = useState(false)

  const handleSave = async () => {
    const parsedProgress = parseInt(progress, 10)
    if (Number.isNaN(parsedProgress) || parsedProgress < 0 || parsedProgress > 100) {
      toast.error('Progress must be a number between 0 and 100')
      return
    }
    if (!title.trim()) {
      toast.error('Title cannot be empty')
      return
    }

    setLoading(true)
    const payload: ProjectDetailsInput = {
      title,
      description,
      status,
      progress: parsedProgress,
      start_date: startDate || null,
      due_date: dueDate || null
    }
    const res = await updateProjectDetails(project.id, payload)
    setLoading(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Project details saved')
      router.refresh()
    }
  }

  const handleRevoke = async () => {
    if (!clientProfileId) return
    setLoading(true)
    const res = await removeClientAccess(project.id, clientProfileId)
    setLoading(false)
    setConfirmRevoke(false)
    if (res?.error) toast.error(res.error)
    else {
      toast.success('Client access revoked')
      router.refresh()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-3">
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Project Controls</h2>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-primary text-white px-4 py-2 min-h-[40px] text-xs font-bold rounded-lg hover:bg-[#ff8947] transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="project-title" className={labelClass}>Project Title</label>
          <input id="project-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="project-description" className={labelClass}>Description (shown to the client)</label>
          <textarea id="project-description" rows={2} value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} resize-y`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label htmlFor="project-status" className={labelClass}>Status</label>
          <select
            id="project-status"
            value={status}
            onChange={e => setStatus(e.target.value as ProjectStatus)}
            className={inputClass}
          >
            {PROJECT_STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="project-progress" className={labelClass}>Progress (%)</label>
          <input
            id="project-progress"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            value={progress}
            onChange={e => setProgress(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="project-start" className={labelClass}>Start Date</label>
          <input id="project-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
        </div>

        <div className="space-y-1">
          <label htmlFor="project-due" className={labelClass}>Due Date</label>
          <input id="project-due" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputClass} />
        </div>
      </div>

      {clientProfileId && (
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          {confirmRevoke ? (
            <>
              <span className="text-xs text-gray-600">Remove {clientName || 'the client'} from this project? They will lose access immediately.</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirmRevoke(false)} disabled={loading} className="px-3 py-2 min-h-[40px] text-xs font-bold text-gray-600 hover:text-gray-900">
                  Keep access
                </button>
                <button type="button" onClick={handleRevoke} disabled={loading} className="px-3 py-2 min-h-[40px] text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
                  Yes, revoke
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmRevoke(true)}
              disabled={loading}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors min-h-[40px]"
            >
              Revoke Client Access
            </button>
          )}
        </div>
      )}
    </div>
  )
}
