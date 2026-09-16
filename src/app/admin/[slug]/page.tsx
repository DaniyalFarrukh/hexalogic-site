import { redirect } from 'next/navigation'

export default async function AdminProjectBasePage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  redirect(`/admin/${params.slug}/milestones`)
}
