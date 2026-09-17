import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LocalTime from '@/components/portal/LocalTime'
import DeleteProjectButton from '@/components/admin/DeleteProjectButton'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  // Fetch all projects + client info + comments + read state
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        role,
        profiles(full_name, company)
      ),
      admin_read_state(last_read_at),
      comments(id, created_at, author_id)
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div className="text-red-500">Failed to load projects.</div>
  }

  // Calculate metrics per project
  const now = new Date()
  const enhancedProjects = projects?.map(p => {
    // Find the client
    const clientMember = p.project_members?.find((m: any) => m.role === 'owner') || p.project_members?.[0]
    const client = clientMember?.profiles

    // Unread comments
    const readState = p.admin_read_state && p.admin_read_state.length > 0 ? p.admin_read_state[0] : null
    const lastRead = readState?.last_read_at ? new Date(readState.last_read_at) : new Date(0)
    
    // We only count comments from other users
    const unreadCount = p.comments?.filter((c: any) => new Date(c.created_at) > lastRead).length || 0

    // Stale check (no update in 14 days)
    const lastUpdated = p.updated_at ? new Date(p.updated_at) : new Date(p.created_at)
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24))
    const isStale = daysSinceUpdate >= 14

    return {
      ...p,
      client,
      unreadCount,
      daysSinceUpdate,
      isStale
    }
  })

  // Calculate Dashboard Metrics
  const totalProjects = enhancedProjects?.length || 0
  const completedProjects = enhancedProjects?.filter(p => p.status === 'completed').length || 0
  const inProgressProjects = enhancedProjects?.filter(p => p.status === 'in_progress').length || 0
  const atRiskProjects = enhancedProjects?.filter(p => p.isStale || p.status === 'on_hold').length || 0

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-wide">Project Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track progress, manage milestones and keep your clients updated.</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 font-medium">
            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(now)}
          </span>
          <Link 
            href="/admin/new"
            className="bg-brand-secondary hover:bg-[#ff8947] text-white px-5 py-2.5 min-h-[44px] flex items-center justify-center text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(255,115,36,0.2)]"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-500 rounded-lg" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalProjects}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Completed</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{completedProjects}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-amber-500 rounded-full border-dashed" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">In Progress</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{inProgressProjects}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">At Risk</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{atRiskProjects}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Projects Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Projects Overview</h2>
            <Link href="/admin" className="text-sm text-brand-secondary hover:text-[#ff8947] font-medium">View All &rarr;</Link>
          </div>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full min-w-[800px] text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                  <th className="px-6 py-4 font-semibold">Due Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enhancedProjects?.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:border-brand-secondary/50 transition-colors">
                          <span className="text-brand-secondary font-bold">{project.title.substring(0, 1)}</span>
                        </div>
                        <div>
                          <Link href={`/admin/${project.slug}`} className="font-bold text-gray-900 hover:text-brand-secondary transition-colors block truncate max-w-[200px]">
                            {project.title}
                          </Link>
                          <div className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">{project.client?.company || 'Unknown Client'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-8 text-right text-gray-700">{project.progress}%</span>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-brand-secondary'}`} style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          project.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          project.status === 'on_hold' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-medium">
                      {project.due_date ? <LocalTime utcString={project.due_date} /> : 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                    </td>
                  </tr>
                ))}
                {(!enhancedProjects || enhancedProjects.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No active projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <span className="text-sm text-brand-secondary font-medium cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 text-brand-secondary text-xs font-bold">AL</div>
                <div>
                  <p className="text-sm text-gray-700"><span className="text-gray-900 font-medium">Ahmad</span> commented on a task</p>
                  <p className="text-xs text-gray-500 mt-1 italic">"Looks great! Please proceed..."</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-600 text-xs font-bold">S</div>
                <div>
                  <p className="text-sm text-gray-700"><span className="text-gray-900 font-medium">System</span></p>
                  <p className="text-xs text-gray-500 mt-1">Project status updated: Development 42%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Milestones</h2>
              <span className="text-sm text-brand-secondary font-medium cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-700 font-medium">Testing Phase</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">In 3 days</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm text-gray-700 font-medium">App Store Prep</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">In 9 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
