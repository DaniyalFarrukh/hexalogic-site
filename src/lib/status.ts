export type ProjectStatus = 'planning' | 'in_progress' | 'review' | 'on_hold' | 'completed' | 'archived'

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

export function statusLabel(status?: string | null) {
  if (!status) return 'Unknown'
  const match = PROJECT_STATUS_OPTIONS.find(o => o.value === status)
  return match ? match.label : status.replace(/_/g, ' ')
}

/** Tailwind classes for a status pill on a light background. */
export function statusBadgeClass(status?: string | null) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'review':
      return 'bg-violet-50 text-violet-700 border-violet-200'
    case 'on_hold':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'archived':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200'
  }
}

export function milestoneStatusLabel(status?: string | null) {
  if (status === 'done') return 'Done'
  if (status === 'in_progress') return 'In progress'
  return 'Pending'
}
