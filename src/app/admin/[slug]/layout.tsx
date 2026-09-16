import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RadialProgress from '@/components/RadialProgress'
import ProjectTimeline from '@/components/ProjectTimeline'
import AdminProjectTabs from '@/components/admin/AdminProjectTabs'

export default async function AdminProjectLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
  }
) {
  const params = await props.params;
  const { slug } = params;
  const supabase = await createClient()

  // Fetch Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        role,
        profiles(id, full_name, company, avatar_url)
      )
    `)
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Fetch milestones for timeline
  const { data: milestones } = await supabase
    .from('milestones')
    .select(`*`)
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  const clientMember = project.project_members?.find((m: any) => m.role === 'owner') || project.project_members?.[0]
  const client = clientMember?.profiles

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <Link href="/admin" className="text-sm font-semibold text-brand-secondary hover:text-[#ff8947] transition-colors mb-3 flex items-center gap-2">
            &larr; Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
              {project.title}
            </h1>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
              project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
              project.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Client: <span className="text-gray-900 font-medium">{client?.company || 'Unknown'}</span> ({client?.full_name})
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href={`/admin/${project.slug}/update`}
            className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 text-sm font-bold rounded-lg transition-colors border border-gray-200 shadow-sm"
          >
            Edit
          </Link>
          <Link 
            href={`/admin/${project.slug}/update`}
            className="bg-brand-secondary text-white px-6 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg"
          >
            Post Update
          </Link>
        </div>
      </div>

      {/* Top Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Progress */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-6 left-8">
            <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
            <p className="text-sm text-gray-500 mt-1">Frontend and backend development in progress.</p>
          </div>
          <div className="mt-12 flex items-center gap-16 w-full justify-center">
            <RadialProgress progress={project.progress} size={180} strokeWidth={16} mode="admin" />
            <div className="space-y-6 w-1/2 hidden md:block">
              <div>
                <p className="text-sm text-gray-500 font-medium">Due Date</p>
                <p className="text-lg text-gray-900 font-semibold">{project.due_date ? new Date(project.due_date).toLocaleDateString() : 'TBD'}</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="lg:col-span-1">
          <ProjectTimeline milestones={milestones || []} mode="admin" />
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col overflow-hidden min-h-[600px]">
        {/* Tab Navigation */}
        <AdminProjectTabs 
          projectSlug={project.slug} 
          tabs={['messages', 'milestones', 'updates', 'files', 'activity']} 
        />

        {/* Tab Content */}
        <div className="p-8 flex-1">
          {props.children}
        </div>
      </div>
    </div>
  )
}
