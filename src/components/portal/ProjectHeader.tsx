import LocalTime from './LocalTime'

export default function ProjectHeader({ project }: { project: any }) {
  const isOverdue = project.due_date && new Date(project.due_date) < new Date() && project.status !== 'completed' && project.status !== 'archived'

  const calculateDaysRemaining = () => {
    if (!project.due_date) return null
    const diff = new Date(project.due_date).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    if (days < 0) return `${Math.abs(days)} days overdue`
    if (days === 0) return 'Due today'
    return `${days} days remaining`
  }

  const daysRemaining = calculateDaysRemaining()

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-200 pb-8">
      <div className="flex-1 max-w-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 border border-gray-200 text-gray-600">
            {project.status.replace('_', ' ')}
          </span>
          {isOverdue && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-red-50 border-2 border-dashed border-red-200 text-red-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Overdue
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 break-words leading-tight uppercase">{project.title}</h1>
        <p className="text-gray-600 text-base">{project.description}</p>
      </div>

      <div className="flex flex-col md:items-end gap-1 min-w-[200px]">
        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Delivery</div>
        <div className="text-xl font-bold text-gray-900">
          <LocalTime utcString={project.due_date} />
        </div>
        {daysRemaining && (
          <div className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-brand-primary'}`}>
            {daysRemaining}
          </div>
        )}
      </div>
    </div>
  )
}
