import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientActivityTracker from '@/components/portal/ClientActivityTracker'
import ProjectRating from '@/components/portal/ProjectRating'
import RadialProgress from '@/components/RadialProgress'
import ProjectTabs from '@/components/portal/ProjectTabs'

export default async function ProjectLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const { slug } = params;
  const supabase = await createClient()

  // 1. Fetch Project (RLS protected)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // 2. Fetch milestones for summary cards
  const { data: milestones } = await supabase
    .from('milestones')
    .select('id, title, status')
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  const currentMilestone = milestones?.find((m: any) => m.status === 'in_progress') || milestones?.find((m: any) => m.status === 'pending')
  const nextMilestone = milestones?.find((m: any) => m.status === 'pending' && m.id !== currentMilestone?.id)
  
  return (
    <div className="w-full max-w-[1600px] mx-auto pb-24 space-y-8">
      <ClientActivityTracker />
      
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden shadow-sm text-gray-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-gray-900">{project.title}</h1>
              <p className="text-sm text-gray-500 mt-1">Project in {project.status.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>Overall Progress</span>
              <span className="text-gray-900">{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 border border-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-1000 ease-out relative"
                style={{ width: `${project.progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500">Current Phase</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">{currentMilestone?.title || 'Planning'}</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500">Next Milestone</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">{nextMilestone?.title || 'Delivery'}</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-gray-500 absolute top-6 left-6">Overall Progress</h3>
          <div className="mt-8">
            <RadialProgress progress={project.progress} size={100} strokeWidth={8} mode="client" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm min-h-[600px] flex flex-col overflow-hidden">
          {/* Tabs */}
          <ProjectTabs 
            projectSlug={project.slug} 
            tabs={['messages', 'updates', 'milestones', 'files', 'details']} 
          />

          <div className="p-8 flex-1">
            {props.children}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Client</span>
                <span className="text-sm font-bold text-gray-900">{project.project_members?.[0]?.profiles?.company || 'Unknown'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Start Date</span>
                <span className="text-sm font-bold text-gray-900">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Due Date</span>
                <span className="text-sm font-bold text-gray-900">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500">Status</span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href={`/portal/${project.slug}/files`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
                View Files
              </Link>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></div>
                Download Report
              </button>
            </div>
          </div>

          {project.status === 'completed' && (
            <ProjectRating projectId={project.id} />
          )}
        </div>
      </div>
    </div>
  )
}
