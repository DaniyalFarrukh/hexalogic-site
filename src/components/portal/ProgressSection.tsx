import LocalTime from './LocalTime'

export default function ProgressSection({ project }: { project: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Project Progress</h2>
        <span className="text-3xl font-bold text-brand-primary">{project.progress}%</span>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden border border-gray-200">
        <div 
          className="bg-brand-primary h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${project.progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse" />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>0%</span>
        <span>
          Last updated: <LocalTime utcString={project.updated_at} />
        </span>
        <span>100%</span>
      </div>
    </div>
  )
}
