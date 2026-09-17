'use client'

import { useState } from 'react'
import { addCredential, updateCredential, deleteCredential } from '@/app/portal/[slug]/credentials/actions'
import { useRouter } from 'next/navigation'

export default function CredentialsManager({ credentials, projectId, isAdmin }: { credentials: any[], projectId: string, isAdmin?: boolean }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ title: '', url: '', username: '', password: '', notes: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      if (editingId) {
        await updateCredential(editingId, formData)
      } else {
        await addCredential(projectId, formData)
      }
      setIsAdding(false)
      setEditingId(null)
      setFormData({ title: '', url: '', username: '', password: '', notes: '' })
      router.refresh()
    } catch (err) {
      alert('An error occurred while saving.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return
    try {
      await deleteCredential(id)
      router.refresh()
    } catch (err) {
      alert('Delete failed')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard')
  }

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const startEditing = (cred: any) => {
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
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Project Credentials</h2>
          <p className="text-sm text-gray-500 mt-1">Securely share passwords and access details for the project.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-brand-secondary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-[#ff8947] transition-colors"
          >
            + Add Credential
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
          <h3 className="font-bold text-gray-900">{editingId ? 'Edit Credential' : 'New Credential'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (e.g., Shopify)</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL (optional)</label>
              <input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username / Email</label>
              <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-brand-secondary focus:border-brand-secondary" rows={2} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ title: '', url: '', username: '', password: '', notes: '' }) }} className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-brand-secondary text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#ff8947] disabled:opacity-50 transition-colors">
              {isSubmitting ? 'Saving...' : 'Save Credential'}
            </button>
          </div>
        </form>
      )}

      {(!credentials || credentials.length === 0) && !isAdding ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          <p>No credentials added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map(cred => (
            <div key={cred.id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group relative bg-white">
              <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                <button onClick={() => startEditing(cred)} className="p-1.5 text-gray-400 hover:text-brand-secondary hover:bg-orange-50 rounded-lg" aria-label="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(cred.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg" aria-label="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1">{cred.title}</h3>
              {cred.url && (
                <a href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`} target="_blank" rel="noreferrer" className="text-sm text-brand-secondary hover:underline break-all mb-4 block">
                  {cred.url}
                </a>
              )}
              
              <div className="space-y-3 mt-4">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Username / Email</div>
                  <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-900 truncate">{cred.username}</span>
                    <button onClick={() => copyToClipboard(cred.username)} className="text-gray-400 hover:text-gray-700 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password</div>
                  <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-900 tracking-wider truncate">
                      {visiblePasswords[cred.id] ? cred.password : '••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePassword(cred.id)} className="text-gray-400 hover:text-gray-700 p-1">
                        {visiblePasswords[cred.id] ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                      <button onClick={() => copyToClipboard(cred.password)} className="text-gray-400 hover:text-gray-700 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {cred.notes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{cred.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
