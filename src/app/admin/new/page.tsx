'use client'

import { useState } from 'react'
import { createClientAndProject } from '../admin-actions'
import Link from 'next/link'
import toast from 'react-hot-toast'

const inputClass =
  'w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary/50 transition-colors'
const labelClass = 'text-[10px] font-bold text-gray-500 uppercase tracking-widest'

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 80)
}

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
  const [slugEdited, setSlugEdited] = useState(false)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!slugEdited) setSlug(slugify(val))
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

  const copyCredentials = async () => {
    if (!success?.credentials?.tempPassword) return
    try {
      await navigator.clipboard.writeText(`Email: ${success.credentials.email}\nPassword: ${success.credentials.tempPassword}`)
      toast.success('Credentials copied to clipboard')
    } catch {
      toast.error('Could not copy. Please select the text manually.')
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wider mb-6">Project Created</h1>

        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          {!success.isNewUser ? (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm font-medium">
              This client already had an account and has been added to the new project. They can sign in with their existing password.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                <h3 className="text-blue-700 font-bold tracking-wider uppercase text-xs">New Client Credentials</h3>
                <p className="text-sm text-gray-600">
                  A welcome email with these details has been sent. Share them securely if needed. <strong className="text-gray-900">They cannot be retrieved again.</strong>
                </p>
                <div className="mt-4 bg-white p-4 rounded border border-gray-200 font-mono text-sm space-y-2 break-all">
                  <div><span className="text-gray-500">Email:</span> <span className="text-gray-900 select-all">{success.credentials?.email}</span></div>
                  <div><span className="text-gray-500">Password:</span> <span className="text-gray-900 select-all">{success.credentials?.tempPassword}</span></div>
                </div>
                <button
                  type="button"
                  onClick={copyCredentials}
                  className="mt-2 bg-white border border-gray-300 px-4 py-2 min-h-[44px] rounded text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <Link
              href={`/admin/${success.slug}`}
              className="bg-brand-secondary text-white px-6 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg text-center"
            >
              Go to Project
            </Link>
            <Link
              href="/admin"
              className="bg-white border border-gray-200 text-gray-700 px-6 py-3 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          &larr; Back
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-wider">New Client &amp; Project</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-8 shadow-sm">
        {error && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Section */}
          <fieldset className="space-y-4">
            <legend className="text-xs font-bold text-brand-secondary uppercase tracking-widest border-b border-gray-100 pb-2 w-full">Client Details</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="full_name" className={labelClass}>Full Name</label>
                <input id="full_name" required name="full_name" type="text" autoComplete="off" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label htmlFor="company" className={labelClass}>Company</label>
                <input id="company" required name="company" type="text" autoComplete="off" className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className={labelClass}>Primary Email</label>
              <input id="email" required name="email" type="email" autoComplete="off" className={inputClass} />
              <p className="text-xs text-gray-500">If this email already has an account, the client is added to the project without creating a new login.</p>
            </div>
          </fieldset>

          {/* Project Section */}
          <fieldset className="space-y-4">
            <legend className="text-xs font-bold text-brand-secondary uppercase tracking-widest border-b border-gray-100 pb-2 w-full">Project Details</legend>
            <div className="space-y-1">
              <label htmlFor="title" className={labelClass}>Project Title</label>
              <input id="title" required name="title" type="text" value={title} onChange={handleTitleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label htmlFor="slug" className={labelClass}>Slug (URL)</label>
              <input
                id="slug"
                required
                name="slug"
                type="text"
                value={slug}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Lowercase letters, numbers and single hyphens only"
                onChange={e => { setSlugEdited(true); setSlug(slugify(e.target.value)) }}
                className={`${inputClass} bg-gray-50 text-gray-600 font-mono`}
              />
              <p className="text-xs text-gray-500">Portal address: /portal/{slug || 'your-slug'}</p>
            </div>
            <div className="space-y-1">
              <label htmlFor="description" className={labelClass}>Description</label>
              <textarea id="description" name="description" rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="start_date" className={labelClass}>Start Date</label>
                <input id="start_date" name="start_date" type="date" className={inputClass} />
              </div>
              <div className="space-y-1">
                <label htmlFor="due_date" className={labelClass}>Due Date</label>
                <input id="due_date" name="due_date" type="date" className={inputClass} />
              </div>
            </div>
          </fieldset>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-brand-secondary text-white px-8 py-3 text-sm font-bold rounded-lg hover:bg-[#ff8947] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Client & Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
