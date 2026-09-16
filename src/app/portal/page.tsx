import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PortalIndex() {
  const supabase = await createClient()

  // Auth guard: redirect to login if not authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/portal/login')
  }

  // If admin, redirect to admin dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role === 'admin') {
    redirect('/admin')
  }
  
  // Get all projects the user is a member of.
  // Because of RLS (is_member(id)), we just query projects.
  const { data: projects, error } = await supabase
    .from('projects')
    .select('slug, title, description, status')
    .order('created_at', { ascending: false })

  if (error || !projects) {
    return <div className="p-6 text-gray-400">Failed to load projects.</div>
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 min-h-[50vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
        <p className="text-gray-400 text-sm max-w-md">
          You don't have any active projects yet. Your team will set one up for you shortly.
        </p>
      </div>
    )
  }

  if (projects.length === 1) {
    redirect(`/portal/${projects[0].slug}`)
  }

  return (
    <div className="container mx-auto px-6 max-w-7xl pt-12 pb-24">
      <h1 className="text-3xl font-bold text-white mb-8">Your Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link href={`/portal/${p.slug}`} key={p.slug} className="block group">
            <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 group-hover:border-brand-primary/50 group-hover:shadow-lg transition-all h-full flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.status.replace('_', ' ')}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-gray-400 text-xs flex-1 mb-6">{p.description}</p>
              
              <div className="mt-auto text-xs font-bold text-brand-primary flex items-center gap-2">
                Open Project 
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>

              {/* Decorative element from the marketing site style */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
