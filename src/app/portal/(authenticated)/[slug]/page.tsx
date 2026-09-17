import { redirect } from 'next/navigation'

export default async function ProjectBasePage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  redirect(`/portal/${params.slug}/updates`)
}
