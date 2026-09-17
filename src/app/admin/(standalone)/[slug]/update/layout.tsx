import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post Update',
}

export default function PostUpdateLayout({ children }: { children: React.ReactNode }) {
  return children
}
