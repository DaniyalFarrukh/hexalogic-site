'use client'

import { useState, useEffect, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { FileText, FileArchive, FileImage, FileSpreadsheet } from 'lucide-react'

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export function PdfThumbnail({ url }: { url: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden pointer-events-none">
      <Document 
        file={url} 
        loading={<div className="animate-pulse bg-gray-100 w-full h-full" />}
        error={<div className="text-xs text-red-400 p-4 text-center">Failed to load preview</div>}
      >
        <Page pageNumber={1} width={300} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  )
}

export function DocxThumbnail({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)
  
  useEffect(() => {
    let active = true
    async function renderDocx() {
      if (!containerRef.current || !url) return
      try {
        const docx = await import('docx-preview')
        const response = await fetch(url)
        if (!response.ok) throw new Error('Fetch failed')
        const blob = await response.blob()
        if (active && containerRef.current) {
          containerRef.current.innerHTML = ''
          await docx.renderAsync(blob, containerRef.current, containerRef.current, {
            inWrapper: false,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: true,
            breakPages: false,
            useBase64URL: true,
          })
        }
      } catch (err) {
        console.error('Failed to render DOCX thumbnail:', err)
        if (active) setError(true)
      }
    }
    renderDocx()
    return () => { active = false }
  }, [url])

  if (error) {
    return <FallbackIcon mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document" caption="Document" />
  }

  return (
    <div className="w-full h-full bg-white overflow-hidden pointer-events-none relative">
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-[800px] origin-top-left scale-[0.3]"
      />
    </div>
  )
}

export function FallbackIcon({ mimeType, caption }: { mimeType?: string | null, caption?: string | null }) {
  let Icon = FileText
  let label = 'FILE'
  let bgColor = 'bg-gray-50 text-gray-500'

  if (mimeType) {
    if (mimeType.includes('pdf')) { Icon = FileText; label = 'PDF'; bgColor = 'bg-red-50 text-red-500' }
    else if (mimeType.includes('word') || mimeType.includes('document')) { Icon = FileText; label = 'DOC'; bgColor = 'bg-blue-50 text-blue-600' }
    else if (mimeType.includes('excel') || mimeType.includes('sheet')) { Icon = FileSpreadsheet; label = 'XLS'; bgColor = 'bg-green-50 text-green-600' }
    else if (mimeType.includes('zip') || mimeType.includes('compressed')) { Icon = FileArchive; label = 'ZIP'; bgColor = 'bg-yellow-50 text-yellow-600' }
    else if (mimeType.includes('image')) { Icon = FileImage; label = 'IMG'; bgColor = 'bg-purple-50 text-purple-600' }
    else if (mimeType.includes('csv')) { Icon = FileSpreadsheet; label = 'CSV'; bgColor = 'bg-emerald-50 text-emerald-600' }
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full group-hover:opacity-90 p-4 transition-all ${bgColor}`}>
      <Icon className="w-10 h-10 mb-3 opacity-80" strokeWidth={1.5} />
      <span className="text-xs font-semibold truncate w-full text-center px-2 text-gray-800">{caption || 'File'}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">{label}</span>
    </div>
  )
}

export function OfficeViewer({ url }: { url: string }) {
  // Use Microsoft Office Online Viewer
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`
  return (
    <iframe
      src={viewerUrl}
      className="w-full h-[70vh] md:h-[80vh] bg-white rounded-lg shadow-2xl"
      frameBorder="0"
    />
  )
}

export function PdfViewer({ url }: { url: string }) {
  return (
    <iframe
      src={url}
      className="w-full h-[70vh] md:h-[80vh] bg-white rounded-lg shadow-2xl"
      frameBorder="0"
    />
  )
}
