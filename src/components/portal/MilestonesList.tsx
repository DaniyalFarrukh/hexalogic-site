import LocalTime from './LocalTime'
import MilestoneActions from './MilestoneActions'
import { CommentSection } from '@/app/portal/[slug]/components/CommentSection'

export default function MilestonesList({ milestones }: { milestones: any[] }) {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Milestones</h2>
        <div className="text-gray-500 text-sm">
          Your project timeline and milestones will be mapped out here once planning is complete.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Milestones</h2>
      
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[14px] before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
        {milestones.map((m, index) => {
          const isActive = m.status === 'active'
          const isDone = m.status === 'done'
          
          return (
            <div key={m.id} className="relative flex items-start gap-6">
              <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 mt-2 ${
                isActive ? 'bg-white border-brand-primary shadow-[0_0_10px_rgba(255,115,36,0.5)]' :
                isDone ? 'bg-brand-primary border-brand-primary' : 'bg-gray-100 border-gray-200'
              }`}>
                {isDone && (
                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${isActive ? 'bg-white border border-brand-primary/30 shadow-lg' : 'bg-gray-50 border border-gray-200'} rounded-xl p-6 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${isActive ? 'text-brand-primary' : isDone ? 'text-gray-900' : 'text-gray-500'}`}>
                    {m.title}
                  </h3>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">Current Phase</span>
                  )}
                </div>
                {m.description && (
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{m.description}</p>
                )}
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <LocalTime utcString={m.due_date} />
                </div>
                
                <MilestoneActions 
                  milestoneId={m.id} 
                  status={m.status} 
                  approvalStatus={m.approval_status} 
                />

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <CommentSection 
                    projectId={m.project_id}
                    targetType="milestone"
                    targetId={m.id}
                    comments={m.comments || []}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
