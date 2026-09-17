'use client'

import { useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import toast from 'react-hot-toast'
import { updateMilestones, type MilestoneInput } from '@/app/admin/admin-actions'
import { CommentSection, type CommentType } from '@/app/portal/(authenticated)/[slug]/components/CommentSection'

type MilestoneStatus = 'pending' | 'in_progress' | 'done'

export type EditableMilestone = {
  id: string
  isNew?: boolean
  project_id: string
  title: string
  description: string
  status: MilestoneStatus
  due_date: string
  approval_status?: string | null
  comments?: CommentType[]
}

type MilestoneRow = {
  id: string
  project_id: string
  title: string
  description?: string | null
  status?: string | null
  due_date?: string | null
  approval_status?: string | null
  comments?: CommentType[]
}

function toEditable(m: MilestoneRow): EditableMilestone {
  return {
    id: m.id,
    project_id: m.project_id,
    title: m.title || '',
    description: m.description || '',
    status: (m.status === 'done' || m.status === 'in_progress') ? m.status : 'pending',
    due_date: m.due_date ? m.due_date.split('T')[0] : '',
    approval_status: m.approval_status,
    comments: m.comments || [],
  }
}

const inputBase = 'w-full bg-transparent border-b border-gray-200 px-1 py-1 focus:outline-none focus:border-brand-primary transition-colors'

function SortableItem({
  milestone,
  onChange,
  onRemove,
}: {
  milestone: EditableMilestone
  onChange: (id: string, field: keyof EditableMilestone, value: string) => void
  onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: milestone.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 p-4 sm:p-6 rounded-xl flex flex-col gap-5 mb-4 hover:border-gray-300 shadow-sm transition-colors">
      <div className="flex items-start gap-3 sm:gap-5 w-full">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${milestone.title || 'milestone'}`}
          className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-900 transition-colors flex-shrink-0 touch-none min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        <div className="flex-1 space-y-2 min-w-0">
          <input
            type="text"
            value={milestone.title}
            onChange={e => onChange(milestone.id, 'title', e.target.value)}
            placeholder="Milestone title"
            aria-label="Milestone title"
            className={`${inputBase} text-gray-900 text-sm font-bold`}
          />
          <input
            type="text"
            value={milestone.description}
            onChange={e => onChange(milestone.id, 'description', e.target.value)}
            placeholder="Description (optional)"
            aria-label="Milestone description"
            className={`${inputBase} text-gray-600 text-xs`}
          />
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold">Status</span>
              <select
                value={milestone.status}
                onChange={e => onChange(milestone.id, 'status', e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-brand-primary"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <span className="font-semibold">Due</span>
              <input
                type="date"
                value={milestone.due_date}
                onChange={e => onChange(milestone.id, 'due_date', e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-brand-primary"
              />
            </label>
            {milestone.approval_status === 'approved' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">Approved by client</span>
            )}
            {milestone.approval_status === 'changes_requested' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Changes requested</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemove(milestone.id)}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 min-w-[32px] min-h-[32px] flex items-center justify-center"
          title="Remove milestone"
          aria-label={`Remove ${milestone.title || 'milestone'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {!milestone.isNew && (
        <div className="border-t border-gray-100 pt-4 w-full">
          <CommentSection
            projectId={milestone.project_id}
            targetType="milestone"
            targetId={milestone.id}
            comments={milestone.comments || []}
          />
        </div>
      )}
    </div>
  )
}

export default function MilestonesManager({
  initialMilestones,
  projectId
}: {
  initialMilestones: MilestoneRow[]
  projectId: string
}) {
  const [milestones, setMilestones] = useState<EditableMilestone[]>(() => initialMilestones.map(toEditable))
  const [loading, setLoading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const tempIdCounter = useRef(0)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setMilestones(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      setDirty(true)
    }
  }

  const handleChange = (id: string, field: keyof EditableMilestone, value: string) => {
    setMilestones(items => items.map(item => item.id === id ? { ...item, [field]: value } : item))
    setDirty(true)
  }

  const handleAdd = () => {
    tempIdCounter.current += 1
    setMilestones(prev => [
      ...prev,
      { id: `new-${tempIdCounter.current}`, isNew: true, title: '', description: '', status: 'pending', due_date: '', project_id: projectId, comments: [] }
    ])
    setDirty(true)
  }

  const handleRemove = (id: string) => {
    const target = milestones.find(m => m.id === id)
    if (target && !target.isNew && (target.comments?.length || 0) > 0) {
      if (!window.confirm('This milestone has comments. Removing it deletes them permanently. Continue?')) return
    }
    setMilestones(items => items.filter(i => i.id !== id))
    setDirty(true)
  }

  const handleSave = async () => {
    if (milestones.some(m => !m.title.trim())) {
      toast.error('Every milestone needs a title')
      return
    }

    setLoading(true)
    const payload: MilestoneInput[] = milestones.map((m, i) => ({
      id: m.isNew ? undefined : m.id,
      title: m.title,
      description: m.description,
      status: m.status,
      position: i + 1,
      due_date: m.due_date || null,
    }))

    const res = await updateMilestones(projectId, payload)
    setLoading(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }

    toast.success('Milestones saved')
    setDirty(false)
    if (res.data) {
      setMilestones((res.data as MilestoneRow[]).map(toEditable))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Milestones</h2>
          <p className="text-xs text-gray-500 mt-1">Drag to reorder. Marking a milestone done notifies subscribed clients.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || !dirty}
          className="bg-brand-primary text-white px-4 py-2 min-h-[40px] text-xs font-bold rounded-lg hover:bg-[#ff8947] transition-colors disabled:opacity-50 shadow-sm whitespace-nowrap"
        >
          {loading ? 'Saving...' : dirty ? 'Save Milestones' : 'Saved'}
        </button>
      </div>

      <DndContext
        id="milestones-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={milestones.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div>
            {milestones.map(m => (
              <SortableItem key={m.id} milestone={m} onChange={handleChange} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {milestones.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">No milestones yet. Add the first phase of this project below.</p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full mt-2 py-3 rounded-lg border border-dashed border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Milestone
      </button>
    </div>
  )
}
