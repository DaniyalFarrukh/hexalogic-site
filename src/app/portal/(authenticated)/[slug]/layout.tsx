import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ClientActivityTracker from '@/components/portal/ClientActivityTracker'
import ProjectRating from '@/components/portal/ProjectRating'
import RadialProgress from '@/components/RadialProgress'
import ProjectTabs from '@/components/portal/ProjectTabs'
import LocalTime from '@/components/portal/LocalTime'
import { statusBadgeClass, statusLabel } from '@/lib/status'

type MemberRow = { role: string; profiles: { full_name: string | null; company: string | null } | null }
type MilestoneRow = { id: string; title: string; status: string; due_date: string | null }

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data: project } = await supabase.from('projects').select('title').eq('slug', slug).maybeSingle()
  return { title: project?.title || 'Project' }
}

export default async function ProjectLayout(
  props: {
    children: React.ReactNode
    params: Promise<{ slug: string }>
  }
) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(
        role,
        profiles(full_name, company)
      )
    `)
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: milestones } = await supabase
    .from('milestones')
    .select('id, title, status, due_date')
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  const milestoneRows = (milestones || []) as MilestoneRow[]
  const currentMilestone = milestoneRows.find(m => m.status === 'in_progress') || milestoneRows.find(m => m.status === 'pending')
  const nextMilestone = milestoneRows.find(m => m.status === 'pending' && m.id !== currentMilestone?.id)
  const doneCount = milestoneRows.filter(m => m.status === 'done').length

  const members = (project.project_members || []) as MemberRow[]
  const owner = members.find(m => m.role === 'owner') || members[0]
  const clientName = owner?.profiles?.company || owner?.profiles?.full_name

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-8 space-y-6 md:space-y-8">
      <ClientActivityTracker />

      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-8 relative overflow-hidden shadow-sm text-gray-900">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-wide text-gray-900 break-words">{project.title}</h1>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusBadgeClass(project.status)}`}>
                {statusLabel(project.status)}
              </span>
            </div>
            {project.description && (
              <p className="text-sm text-gray-500 mt-2 max-w-2xl">{project.description}</p>
            )}
          </div>
          <div className="w-full md:w-64 space-y-2 shrink-0">
            <div className="flex justify-between text-sm font-semibold text-gray-700">
              <span>Overall Progress</span>
              <span className="text-gray-900">{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 border border-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full bg-brand-primary transition-all duration-1000 ease-out"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white border border-gray-100 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500">Current Phase</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">{currentMilestone?.title || (milestoneRows.length > 0 && doneCount === milestoneRows.length ? 'All milestones complete' : 'Not started yet')}</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-500">Next Milestone</h3>
          </div>
          <p className="text-lg font-bold text-gray-900">{nextMilestone?.title || 'None scheduled'}</p>
        </div>

        <div className="bg-white border border-gray-100 p-5 md:p-6 rounded-2xl shadow-sm flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Milestones</h3>
            <p className="text-lg font-bold text-gray-900 mt-1">{doneCount} of {milestoneRows.length} done</p>
          </div>
          <RadialProgress progress={project.progress} size={88} strokeWidth={8} mode="client" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm min-h-[420px] flex flex-col overflow-hidden">
          <ProjectTabs
            projectSlug={project.slug}
            tabs={['updates', 'messages', 'milestones', 'files', 'credentials', 'bugs', 'details']}
          />
          <div className="p-4 sm:p-6 md:p-8 flex-1">
            {props.children}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>
            <dl className="space-y-1">
              <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-50">
                <dt className="text-sm text-gray-500">Client</dt>
                <dd className="text-sm font-bold text-gray-900 text-right truncate">{clientName || '—'}</dd>
              </div>
              <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-50">
                <dt className="text-sm text-gray-500">Start Date</dt>
                <dd className="text-sm font-bold text-gray-900">{project.start_date ? <LocalTime utcString={project.start_date} /> : 'TBD'}</dd>
              </div>
              <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-50">
                <dt className="text-sm text-gray-500">Due Date</dt>
                <dd className="text-sm font-bold text-gray-900">{project.due_date ? <LocalTime utcString={project.due_date} /> : 'TBD'}</dd>
              </div>
              <div className="flex justify-between items-center gap-3 py-2">
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusBadgeClass(project.status)}`}>
                    {statusLabel(project.status)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href={`/portal/${project.slug}/files`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
                View Files
              </Link>
              <Link href={`/portal/${project.slug}/messages`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg></div>
                Message the Team
              </Link>
              <Link href="/contact" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-primary flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                Contact Support
              </Link>
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
