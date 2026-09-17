export type ActivityEventType =
  | 'project_created'
  | 'project_updated'
  | 'milestone_created'
  | 'milestone_updated'
  | 'milestone_approved'
  | 'milestone_changes_requested'
  | 'approval_given'
  | 'update_published'
  | 'comment_added'
  | 'message_sent'
  | 'file_uploaded'
  | 'client_logged_in'
  | string

/** Human-readable sentence for an activity_log row. */
export function describeActivity(eventType: ActivityEventType, actorName?: string | null, payload?: Record<string, unknown> | null) {
  const actor = actorName || 'Someone'
  switch (eventType) {
    case 'project_created':
      return 'Project was created.'
    case 'project_updated':
      return `${actor} updated the project details.`
    case 'milestone_created':
      return `${actor} added a new milestone.`
    case 'milestone_updated':
      return `${actor} updated a milestone.`
    case 'milestone_approved':
      return `${actor} approved a milestone.`
    case 'milestone_changes_requested':
      return `${actor} requested changes on a milestone.`
    case 'approval_given': {
      const status = typeof payload?.status === 'string' ? payload.status : ''
      return status === 'changes_requested'
        ? `${actor} requested changes on a milestone.`
        : `${actor} approved a milestone.`
    }
    case 'update_published':
      return `${actor} published a project update.`
    case 'comment_added':
      return `${actor} left a new comment.`
    case 'message_sent':
      return `${actor} sent a message.`
    case 'file_uploaded':
      return `${actor} uploaded a file.`
    case 'client_logged_in':
      return `${actor} signed in to the portal.`
    default:
      return `${actor} recorded new activity.`
  }
}

/** Relative time such as "3 minutes ago". */
export function timeAgo(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]
  for (const [size, name] of units) {
    const count = Math.floor(seconds / size)
    if (count >= 1) return `${count} ${name}${count === 1 ? '' : 's'} ago`
  }
  return 'just now'
}
