-- 0010's "Select co-member or admin profiles" policy had two problems, found in a follow-up
-- security review:
-- 1. It checked membership via a raw project_members self-join instead of calling is_member(),
--    so unlike every other membership-gated policy it did NOT respect
--    projects.access_revoked_at. (Nothing sets that column today, so this was unreachable in
--    practice, but it's exactly the kind of silent trap the 2026-09-17 audit already flagged
--    elsewhere — no reason to add a fourth instance of it.)
-- 2. `role = 'admin'` let any authenticated client read every admin's full profile row
--    (company, timezone, last_seen_at, email_prefs) platform-wide, not just an admin on a
--    project they actually share. The admin on a given project is always also a
--    project_members row for it (see createProject in admin-actions.ts), so plain
--    co-membership already covers the real "who am I chatting with" case without the
--    broader exposure.

DROP POLICY IF EXISTS "Select co-member or admin profiles" ON public.profiles;

CREATE POLICY "Select co-member profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.project_members pm_self
    JOIN public.project_members pm_other ON pm_other.project_id = pm_self.project_id
    JOIN public.projects p ON p.id = pm_self.project_id
    WHERE pm_self.profile_id = auth.uid()
      AND pm_other.profile_id = public.profiles.id
      AND (p.access_revoked_at IS NULL OR p.access_revoked_at > now())
  )
);
