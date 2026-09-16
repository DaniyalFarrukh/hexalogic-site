'use client'

import { useState, useEffect } from 'react'
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
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { updateMilestones } from '@/app/admin/admin-actions'
import { CommentSection } from '@/app/portal/[slug]/components/CommentSection'

function SortableItem({ id, milestone, onChange, onRemove }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col gap-6 mb-4 group hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-300">
      <div className="flex items-start gap-6 w-full">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-900 transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        
        <div className="flex-1 space-y-2 min-w-0">
          <input 
            type="text" 
            value={milestone.title}
            onChange={e => onChange(id, 'title', e.target.value)}
            placeholder="Milestone Title"
            className="w-full bg-transparent border-b border-gray-200 px-1 py-1 text-gray-900 text-sm font-bold focus:outline-none focus:border-brand-primary transition-colors"
          />
          <input 
            type="text" 
            value={milestone.description}
            onChange={e => onChange(id, 'description', e.target.value)}
            placeholder="Description (optional)"
            className="w-full bg-transparent border-b border-gray-200 px-1 py-1 text-gray-500 text-xs focus:outline-none focus:border-brand-primary transition-colors"
          />
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs text-gray-400">
              <input 
                type="checkbox"
                checked={milestone.status === 'done'}
                onChange={e => onChange(id, 'status', e.target.checked ? 'done' : 'pending')}
                className="rounded bg-gray-50 border-gray-300 text-brand-primary focus:ring-brand-primary/50"
              />
              Completed
            </label>
            {milestone.approval_status === 'approved' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Approved</span>
            )}
            {milestone.approval_status === 'changes_requested' && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-0.5 rounded">Changes Requested</span>
            )}
          </div>
        </div>

        <button 
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0"
          title="Remove Milestone"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {milestone.id && milestone.id.toString().length > 15 && (
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
  initialMilestones: any[], 
  projectId: string 
}) {
  const [milestones, setMilestones] = useState(initialMilestones.map(m => ({
    ...m,
    id: m.id || Math.random().toString(36).substr(2, 9) // In case of new unsaved ones
  })))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMilestones(initialMilestones.map(m => ({
      ...m,
      id: m.id || Math.random().toString(36).substr(2, 9)
    })))
  }, [initialMilestones])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setMilestones((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleChange = (id: string, field: string, value: any) => {
    setMilestones(items => items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleAdd = () => {
    setMilestones([
      ...milestones, 
      { id: Math.random().toString(36).substr(2, 9), title: '', description: '', status: 'pending', project_id: projectId }
    ])
  }

  const handleRemove = (id: string) => {
    setMilestones(items => items.filter(i => i.id !== id))
  }

  const handleSave = async () => {
    setLoading(true)
    // Update positions
    const finalMilestones = milestones.map((m, i) => ({
      ...m,
      position: i + 1,
      // If id is our temporary random string, remove it so DB auto-generates
      id: m.id.toString().length < 15 ? undefined : m.id 
    }))

    const res = await updateMilestones(projectId, finalMilestones)
    if (res?.error) {
      alert(res.error)
    } else {
      // Reload or just show success
      if (res.data) {
        setMilestones(res.data)
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-widest">Milestones</h2>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-white border border-gray-200 text-gray-900 px-4 py-1.5 text-xs font-bold rounded hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Milestones'}
        </button>
      </div>

      <DndContext 
        id="milestones-dnd-context"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={milestones.map(m => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {milestones.map(m => (
              <SortableItem 
                key={m.id} 
                id={m.id} 
                milestone={m} 
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button 
        onClick={handleAdd}
        className="w-full mt-4 py-3 rounded-lg border border-dashed border-gray-300 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Milestone
      </button>
    </div>
  )
}
