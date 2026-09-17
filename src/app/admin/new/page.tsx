'use client'

import { useState } from 'react'
import { createClientAndProject } from '../admin-actions'
import Link from 'next/link'

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    isNewUser: boolean;
    credentials?: { email: string; tempPassword?: string };
    slug: string;
  } | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!success) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await createClientAndProject(formData)
    
    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else if (res.success) {
      setSuccess({
        isNewUser: res.isNewUser,
        credentials: res.credentials,
        slug: res.slug!
      })
      setLoading(false)
    }
  }

  const copyCredentials = () => {
    if (success?.credentials?.tempPassword) {
      navigator.clipboard.writeText(`Email: ${success.credentials.email}\nPassword: ${success.credentials.tempPassword}`)
      alert('Credentials copied to clipboard!')
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wider mb-6">Project Created</h1>
        
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
          {!success.isNewUser ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-brand-secondary font-medium">
              Client already existed in the system and has been securely added to this project.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <h3 className="text-blue-600 font-bold tracking-wider uppercase text-xs">New Client Credentials</h3>
                <p className="text-sm text-gray-600">
                  Please securely share these credentials with the client. <strong className="text-gray-900">They cannot be retrieved again.</strong>
                </p>
                <div className="mt-4 bg-white p-4 rounded border border-gray-200 font-mono text-sm space-y-2">
                  <div><span className="text-gray-500">Email:</span> <span className="text-gray-900">{success.credentials?.email}</span></div>
                  <div><span className="text-gray-500">Password:</span> <span className="text-gray-900">{success.credentials?.tempPassword}</span></div>
                </div>
                <button 
                  onClick={copyCredentials}
                  className="mt-2 bg-white border border-gray-300 px-4 py-2 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <Link 
              href={`/admin/${success.slug}`}
              className="bg-brand-secondary text-white px-6 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg"
            >
              Go to Project
            </Link>
            <Link 
              href="/admin"
              className="bg-white border border-gray-200 text-gray-700 px-6 py-3 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors">
          &larr; Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 tracking-wider">New Client & Project</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest border-b border-gray-100 pb-2">Client Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <input required name="full_name" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company</label>
                <input required name="company" type="text" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Primary Email</label>
              <input required name="email" type="email" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" />
            </div>
          </div>

          {/* Project Section */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-brand-secondary uppercase tracking-widest border-b border-gray-100 pb-2">Project Details</h2>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Project Title</label>
              <input 
                required 
                name="title" 
                type="text" 
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Slug (URL)</label>
              <input 
                required 
                name="slug" 
                type="text" 
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-600 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors font-mono" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
              <textarea 
                name="description" 
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors resize-none" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Start Date</label>
                <input name="start_date" type="date" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Due Date</label>
                <input name="due_date" type="date" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-secondary text-white px-8 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Client & Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
