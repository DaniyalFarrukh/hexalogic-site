import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LocalTime from '@/components/portal/LocalTime'
import DeleteProjectButton from '@/components/admin/DeleteProjectButton'
import { statusBadgeClass, statusLabel } from '@/lib/status'
import { describeActivity, timeAgo } from '@/lib/activity'

export const metadata: Metadata = {
  title: 'Dashboard',
}

type MemberRow = { role: string; profiles: { full_name: string | null; company: string | null } | null }
type CommentRow = { id: string; created_at: string; author_id: string | null }
type ProjectRow = {
  id: string
  slug: string
  title: string
  status: string
  progress: number
  due_date: string | null
  updated_at: string | null
  created_at: string
  project_members: MemberRow[] | null
  admin_read_state: { last_read_at: string | null }[] | null
  comments: CommentRow[] | null
}
type ActivityRow = {
  id: string
  event_type: string
  payload: Record<string, unknown> | null
  created_at: string
  projects: { slug: string; title: string } | null
  profiles: { full_name: string | null } | null
}
type UpcomingMilestone = {
  id: string
  title: string
  due_date: string | null
  status: string
  projects: { slug: string; title: string } | null
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/admin/login')
  }

  const today = new Date().toISOString().split('T')[0]

  const [{ data: projects, error }, { data: activity }, { data: upcoming }] = await Promise.all([
    supabase
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
      .order('updated_at', { ascending: false }),
    supabase
      .from('activity_log')
      .select('id, event_type, payload, created_at, projects(slug, title), profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('milestones')
      .select('id, title, due_date, status, projects(slug, title)')
      .neq('status', 'done')
      .gte('due_date', today)
      .order('due_date', { ascending: true })
      .limit(5),
  ])

  if (error) {
    console.error(error)
    return <div className="text-red-600">Failed to load projects.</div>
  }

  const now = new Date()
  const enhancedProjects = ((projects || []) as unknown as ProjectRow[]).map(p => {
    const clientMember = p.project_members?.find(m => m.role === 'owner') || p.project_members?.[0]
    const client = clientMember?.profiles

    const readState = p.admin_read_state?.[0]
    const lastRead = readState?.last_read_at ? new Date(readState.last_read_at) : new Date(0)
    const unreadCount = (p.comments || []).filter(c => c.author_id !== user.id && new Date(c.created_at) > lastRead).length

    const lastUpdated = p.updated_at ? new Date(p.updated_at) : new Date(p.created_at)
    const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24))
    const isStale = daysSinceUpdate >= 14 && p.status !== 'completed' && p.status !== 'archived'

    return { ...p, client, unreadCount, daysSinceUpdate, isStale }
  })

  const totalProjects = enhancedProjects.length
  const completedProjects = enhancedProjects.filter(p => p.status === 'completed').length
  const inProgressProjects = enhancedProjects.filter(p => p.status === 'in_progress').length
  const atRiskProjects = enhancedProjects.filter(p => p.isStale || p.status === 'on_hold').length

  const activityRows = (activity || []) as unknown as ActivityRow[]
  const upcomingRows = (upcoming || []) as unknown as UpcomingMilestone[]

  const summary = [
    { label: 'Total Projects', value: totalProjects, accent: 'bg-blue-500', tint: 'bg-blue-500/10 text-blue-600' },
    { label: 'Completed', value: completedProjects, accent: 'bg-emerald-500', tint: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'In Progress', value: inProgressProjects, accent: 'bg-amber-500', tint: 'bg-amber-500/10 text-amber-600' },
    { label: 'At Risk', value: atRiskProjects, accent: 'bg-rose-500', tint: 'bg-rose-500/10 text-rose-600' },
  ]

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-wide">Project Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track progress, manage milestones and keep your clients updated.</p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(now)}
          </span>
          <Link
            href="/admin/new"
            className="bg-brand-secondary hover:bg-[#ff8947] text-white px-5 py-2.5 min-h-[44px] flex items-center justify-center text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(255,115,36,0.2)] whitespace-nowrap"
          >
            + New Project
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {summary.map(card => (
          <div key={card.label} className="bg-white border border-gray-200 p-4 md:p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${card.tint}`}>
              <span className="text-lg font-bold">{card.value}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500 font-medium truncate">{card.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Projects Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Projects Overview</h2>
            <span className="text-sm text-gray-500 font-medium">{totalProjects} total</span>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[720px] text-left text-sm text-gray-700">
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
                {enhancedProjects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:border-brand-secondary/50 transition-colors">
                          <span className="text-brand-secondary font-bold">{project.title.substring(0, 1).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/${project.slug}`} className="font-bold text-gray-900 hover:text-brand-secondary transition-colors block truncate max-w-[220px]">
                            {project.title}
                          </Link>
                          <div className="text-xs text-gray-500 truncate max-w-[220px] mt-0.5 flex items-center gap-2">
                            <span>{project.client?.company || project.client?.full_name || 'Unknown client'}</span>
                            {project.unreadCount > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-brand-secondary/10 text-brand-secondary text-[10px] font-bold">
                                {project.unreadCount} new
                              </span>
                            )}
                            {project.isStale && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">
                                {project.daysSinceUpdate}d idle
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-8 text-right text-gray-700">{project.progress}%</span>
                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100}>
                          <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-brand-secondary'}`} style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadgeClass(project.status)}`}>
                          {statusLabel(project.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-medium">
                      {project.due_date ? <LocalTime utcString={project.due_date} /> : 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DeleteProjectButton projectId={project.id} projectTitle={project.title} />
                    </td>
                  </tr>
                ))}
                {enhancedProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No projects yet. Create your first one to get started.
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
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
            {activityRows.length === 0 ? (
              <p className="text-sm text-gray-500">No activity recorded yet.</p>
            ) : (
              <ul className="space-y-4">
                {activityRows.map(item => {
                  const actor = item.profiles?.full_name || 'System'
                  return (
                    <li key={item.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 text-brand-secondary text-xs font-bold">
                        {actor.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700">{describeActivity(item.event_type, actor, item.payload)}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {item.projects ? (
                            <Link href={`/admin/${item.projects.slug}/activity`} className="hover:text-brand-secondary">{item.projects.title}</Link>
                          ) : 'Portal'}
                          <span aria-hidden="true"> · </span>
                          {timeAgo(item.created_at)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Milestones</h2>
            {upcomingRows.length === 0 ? (
              <p className="text-sm text-gray-500">No milestones with upcoming due dates.</p>
            ) : (
              <ul className="space-y-4">
                {upcomingRows.map(m => (
                  <li key={m.id} className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'in_progress' ? 'bg-brand-secondary' : 'bg-gray-400'}`} />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-700 font-medium block truncate">{m.title}</span>
                        {m.projects && (
                          <Link href={`/admin/${m.projects.slug}/milestones`} className="text-xs text-gray-500 hover:text-brand-secondary block truncate">
                            {m.projects.title}
                          </Link>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                      {m.due_date ? <LocalTime utcString={m.due_date} /> : 'TBD'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
