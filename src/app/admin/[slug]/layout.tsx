import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RadialProgress from '@/components/RadialProgress'
import ProjectTimeline from '@/components/ProjectTimeline'
import AdminProjectTabs from '@/components/admin/AdminProjectTabs'
import LocalTime from '@/components/portal/LocalTime'
import { statusBadgeClass, statusLabel } from '@/lib/status'

type MemberRow = { role: string; profiles: { id: string; full_name: string | null; company: string | null } | null }

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data: project } = await supabase.from('projects').select('title').eq('slug', slug).maybeSingle()
  return { title: project?.title || 'Project' }
}

export default async function AdminProjectLayout(
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
        profiles(id, full_name, company, avatar_url)
      )
    `)
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: milestones } = await supabase
    .from('milestones')
    .select('id, title, description, status, due_date, position')
    .eq('project_id', project.id)
    .order('position', { ascending: true })

  const members = (project.project_members || []) as MemberRow[]
  const clientMember = members.find(m => m.role === 'owner') || members[0]
  const client = clientMember?.profiles

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="min-w-0">
          <Link href="/admin" className="text-sm font-semibold text-brand-secondary hover:text-[#ff8947] transition-colors mb-3 inline-flex items-center gap-2">
            &larr; Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide break-words">
              {project.title}
            </h1>
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border whitespace-nowrap ${statusBadgeClass(project.status)}`}>
              {statusLabel(project.status)}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Client: <span className="text-gray-900 font-medium">{client?.company || 'Unknown'}</span>
            {client?.full_name ? ` (${client.full_name})` : ''}
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <Link
            href={`/admin/${project.slug}/update`}
            className="bg-brand-secondary text-white px-6 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg text-center flex-1 md:flex-none"
          >
            Post Update
          </Link>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Overall Progress</h2>
            {project.description ? (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Progress is set manually from Project Controls on the Milestones tab.</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 justify-center">
            <RadialProgress progress={project.progress} size={180} strokeWidth={16} mode="admin" />
            <div className="space-y-6 w-full sm:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Start Date</p>
                  <p className="text-base text-gray-900 font-semibold">{project.start_date ? <LocalTime utcString={project.start_date} /> : 'TBD'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Due Date</p>
                  <p className="text-base text-gray-900 font-semibold">{project.due_date ? <LocalTime utcString={project.due_date} /> : 'TBD'}</p>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="h-full bg-brand-secondary rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProjectTimeline milestones={milestones || []} startDate={project.start_date} dueDate={project.due_date} mode="admin" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl flex flex-col overflow-hidden min-h-[420px]">
        <AdminProjectTabs
          projectSlug={project.slug}
          tabs={['milestones', 'messages', 'updates', 'files', 'credentials', 'bugs', 'activity']}
        />
        <div className="p-4 sm:p-6 md:p-8 flex-1">
          {props.children}
        </div>
      </div>
    </div>
  )
}
