export type MediaKind = 'image' | 'video' | 'file'

/** Classifies a file by MIME type. */
export function kindFromMime(mime: string): MediaKind {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  return 'file'
}

/** Guesses the media kind of an external link so galleries can render it sensibly. */
export function kindFromUrl(url: string): MediaKind {
  const lower = url.toLowerCase()
  if (/\.(png|jpe?g|gif|webp|avif|svg)(\?|$)/.test(lower)) return 'image'
  if (/\.(mp4|webm|mov|m4v)(\?|$)/.test(lower) || /youtube\.com|youtu\.be|vimeo\.com|loom\.com/.test(lower)) return 'video'
  return 'file'
}

export function isExternalPath(path: string) {
  return path.startsWith('http://') || path.startsWith('https://')
}

export function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
