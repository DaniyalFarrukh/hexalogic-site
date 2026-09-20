-- Allow clients to see the profiles of admins who have communicated with them in their projects.
-- This replaces the "Select co-member profiles" policy to broaden access slightly, 
-- fixing the "Unknown User" bug when a non-creator admin sends a message.

DROP POLICY IF EXISTS "Select co-member profiles" ON public.profiles;

CREATE POLICY "Select co-member or communicating admin profiles" ON public.profiles
FOR SELECT USING (
  -- Co-members (existing logic)
  EXISTS (
    SELECT 1 FROM public.project_members pm_self
    JOIN public.project_members pm_other ON pm_other.project_id = pm_self.project_id
    JOIN public.projects p ON p.id = pm_self.project_id
    WHERE pm_self.profile_id = auth.uid()
      AND pm_other.profile_id = public.profiles.id
      AND (p.access_revoked_at IS NULL OR p.access_revoked_at > now())
  )
  OR
  -- Admins who have interacted (messages) in a shared project
  (public.profiles.role = 'admin' AND EXISTS (
    SELECT 1 FROM public.project_members pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.profile_id = auth.uid()
      AND (p.access_revoked_at IS NULL OR p.access_revoked_at > now())
      AND (
        EXISTS (SELECT 1 FROM public.messages m WHERE m.project_id = pm.project_id AND m.sender_id = public.profiles.id) OR
        EXISTS (SELECT 1 FROM public.comments c WHERE c.project_id = pm.project_id AND c.author_id = public.profiles.id) OR
        EXISTS (SELECT 1 FROM public.updates u WHERE u.project_id = pm.project_id AND u.author_id = public.profiles.id)
      )
  ))
);
