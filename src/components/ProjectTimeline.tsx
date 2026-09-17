import React from 'react'
import { IconSearch, IconPalette, IconCode, IconBug, IconRocket, IconCalendarEvent, IconFlag } from '@tabler/icons-react'

export type TimelineMilestone = {
  id: string
  title: string
  description?: string | null
  status: 'pending' | 'in_progress' | 'done' | string
  due_date?: string | null
  position?: number
}

const STEP_ICONS = [IconSearch, IconPalette, IconCode, IconBug, IconRocket]

function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default function ProjectTimeline({
  milestones,
  startDate,
  dueDate,
}: {
  milestones: TimelineMilestone[]
  startDate?: string | null
  dueDate?: string | null
  mode?: 'admin' | 'client'
}) {
  const steps = [...(milestones || [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const done = steps.filter(s => s.status === 'done').length
  const active = steps.filter(s => s.status === 'in_progress').length
  const progress = steps.length ? Math.round(((done + active * 0.5) / steps.length) * 100) : 0

  const start = formatDate(startDate)
  const end = formatDate(dueDate)
  const range = start && end ? `${start} – ${end}` : start ? `Started ${start}` : end ? `Due ${end}` : 'Dates to be confirmed'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 font-sans w-full">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="font-semibold text-base text-gray-900">Project timeline</h3>
        {steps.length > 0 && (
          <div className="bg-brand-primary/10 text-brand-primary text-xs font-semibold rounded-full px-2.5 py-1 whitespace-nowrap">
            {done}/{steps.length} milestones done
          </div>
        )}
      </div>
      <div className="text-sm text-gray-500 mb-6">{range}</div>

      {steps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Milestones will appear here once the project plan is set.
        </div>
      ) : (
        <div className="relative" role="list" aria-label={`Timeline, ${progress}% complete`}>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1
            const isActive = step.status === 'in_progress'
            const isDone = step.status === 'done'
            const Icon = STEP_ICONS[index] || IconFlag
            const due = formatDate(step.due_date)

            return (
              <div key={step.id} role="listitem" className={`relative flex items-start ${!isLast ? 'pb-7' : ''}`}>
                {!isLast && (
                  <div className="absolute left-[9px] top-3 -bottom-3 w-px bg-gray-200 z-0" aria-hidden="true" />
                )}

                <div className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 ${
                  isActive ? 'bg-white border-brand-primary shadow-[0_0_0_4px_rgba(255,115,36,0.15)] text-brand-primary' :
                  isDone ? 'bg-brand-primary border-brand-primary text-white' :
                  'bg-white border-gray-300 text-gray-400'
                }`}>
                  <Icon size={11} stroke={2.5} />
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-sm ${isActive || isDone ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'}`}>
                      {step.title}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isActive ? 'bg-brand-primary/10 text-brand-primary' :
                      isDone ? 'bg-emerald-50 text-emerald-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {isActive ? 'In progress' : isDone ? 'Done' : 'Pending'}
                    </span>
                  </div>

                  {step.description && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-2">{step.description}</p>
                  )}

                  {due && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <IconCalendarEvent size={14} />
                      <span>Due {due}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
