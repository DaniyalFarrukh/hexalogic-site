'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Copy, Pencil, Trash2, KeyRound } from 'lucide-react'
import { addCredential, updateCredential, deleteCredential, type CredentialInput } from '@/app/portal/(authenticated)/[slug]/credentials/actions'

export type Credential = {
  id: string
  title: string
  url: string | null
  username: string
  password: string
  notes: string | null
  created_at: string
}

const EMPTY: CredentialInput = { title: '', url: '', username: '', password: '', notes: '' }

const inputClass = 'w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary'

export default function CredentialsManager({ credentials, projectId }: { credentials: Credential[]; projectId: string; isAdmin?: boolean }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CredentialInput>(EMPTY)
  const [showFormPassword, setShowFormPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const router = useRouter()

  const resetForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData(EMPTY)
    setShowFormPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = editingId
      ? await updateCredential(editingId, formData)
      : await addCredential(projectId, formData)

    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
      return
    }

    toast.success(editingId ? 'Credential updated' : 'Credential added')
    resetForm()
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const res = await deleteCredential(id)
    setPendingDelete(null)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success('Credential deleted')
    router.refresh()
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const startEditing = (cred: Credential) => {
    setFormData({
      title: cred.title,
      url: cred.url || '',
      username: cred.username,
      password: cred.password,
      notes: cred.notes || ''
    })
    setEditingId(cred.id)
    setIsAdding(true)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Credentials</h2>
          <p className="text-sm text-gray-500 mt-1">Share logins the team needs for this project. Visible to you and HexaLogic only.</p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-brand-secondary text-white px-4 py-2 min-h-[44px] rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] transition-colors"
          >
            + Add Credential
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-5 sm:p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Edit Credential' : 'New Credential'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cred-title" className="block text-sm font-medium text-gray-700 mb-1">Title (e.g. Shopify)</label>
              <input id="cred-title" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cred-url" className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
              <input id="cred-url" type="text" inputMode="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} className={inputClass} placeholder="admin.example.com" />
            </div>
            <div>
              <label htmlFor="cred-username" className="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
              <input id="cred-username" required autoComplete="off" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="cred-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="cred-password"
                  required
                  type={showFormPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(v => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                  aria-label={showFormPassword ? 'Hide password' : 'Show password'}
                >
                  {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="cred-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea id="cred-notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className={inputClass} rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 min-h-[44px] text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 min-h-[44px] bg-brand-secondary text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] disabled:opacity-50 transition-colors">
              {isSubmitting ? 'Saving...' : 'Save Credential'}
            </button>
          </div>
        </form>
      )}

      {(!credentials || credentials.length === 0) && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
          <KeyRound className="w-10 h-10 mx-auto mb-3 text-gray-400" aria-hidden="true" />
          <p>No credentials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {credentials.map(cred => (
            <div key={cred.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-bold text-gray-900 text-lg break-words">{cred.title}</h3>
                <div className="flex gap-1 shrink-0">
                  <button type="button" onClick={() => startEditing(cred)} className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-brand-secondary hover:bg-orange-50 rounded-lg" aria-label={`Edit ${cred.title}`}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setPendingDelete(cred.id)} className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" aria-label={`Delete ${cred.title}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {cred.url && (
                <a href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`} target="_blank" rel="noreferrer" className="text-sm text-brand-secondary hover:underline break-all mb-4 block">
                  {cred.url}
                </a>
              )}

              {pendingDelete === cred.id && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex flex-wrap items-center justify-between gap-2">
                  <span>Delete this credential?</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPendingDelete(null)} className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900">Cancel</button>
                    <button type="button" onClick={() => handleDelete(cred.id)} className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded">Delete</button>
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username / Email</div>
                  <div className="flex items-center justify-between gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-900 truncate">{cred.username}</span>
                    <button type="button" onClick={() => copyToClipboard(cred.username, 'Username')} className="text-gray-400 hover:text-gray-700 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Copy username">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</div>
                  <div className="flex items-center justify-between gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-900 tracking-wider truncate font-mono">
                      {visiblePasswords[cred.id] ? cred.password : '••••••••••••'}
                    </span>
                    <div className="flex items-center shrink-0">
                      <button type="button" onClick={() => togglePassword(cred.id)} className="text-gray-400 hover:text-gray-700 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label={visiblePasswords[cred.id] ? 'Hide password' : 'Show password'}>
                        {visiblePasswords[cred.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button type="button" onClick={() => copyToClipboard(cred.password, 'Password')} className="text-gray-400 hover:text-gray-700 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Copy password">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {cred.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{cred.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
