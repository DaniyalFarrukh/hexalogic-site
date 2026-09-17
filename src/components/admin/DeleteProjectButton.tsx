'use client'

import { useState } from 'react'
import { deleteProject } from '@/app/admin/admin-actions'

export default function DeleteProjectButton({ projectId, projectTitle }: { projectId: string, projectTitle: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== `"${projectTitle}"`) return
    setIsDeleting(true)
    
    try {
      const res = await deleteProject(projectId)
      if (res.error) {
        alert(res.error)
      } else {
        setIsOpen(false)
      }
    } catch (err) {
      alert('An error occurred while deleting the project.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="min-w-[44px] min-h-[44px] flex items-center justify-center p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Project"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm text-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Delete Project</h3>
            
            <div className="mb-6 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2 whitespace-normal break-words">
                Please type <strong className="select-all">"{projectTitle}"</strong> to confirm.
              </label>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
                placeholder={projectTitle}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsOpen(false)
                  setConfirmText('')
                }}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors min-h-[44px] flex items-center"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={confirmText !== `"${projectTitle}"` || isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 disabled:opacity-50 transition-colors min-h-[44px] flex items-center"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
