export default function StatsStrip({ project, updatesCount }: { project: any, updatesCount: number }) {
  const calculateDaysElapsed = () => {
    if (!project.start_date) return 'TBD'
    const diff = new Date().getTime() - new Date(project.start_date).getTime()
    const days = Math.max(0, Math.floor(diff / (1000 * 3600 * 24)))
    return days.toString()
  }

  const calculateDaysRemaining = () => {
    if (!project.due_date) return 'TBD'
    const diff = new Date(project.due_date).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 3600 * 24))
    return days < 0 ? '0' : days.toString()
  }

  const stats = [
    { label: 'Hours Logged', value: project.hours_logged || '0' },
    { label: 'Days Elapsed', value: calculateDaysElapsed() },
    { label: 'Days Remaining', value: calculateDaysRemaining() },
    { label: 'Total Updates', value: updatesCount.toString() },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label}</div>
          <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}
