-- Fix 1: clients can only ever SELECT their own profiles row, so any message,
-- comment, or activity-log entry authored by someone else (most commonly the
-- admin) renders as "Unknown User" once joined against `profiles`.
-- Allow reading a profile when it belongs to an admin, or to anyone who
-- shares a project membership with the requester.
CREATE POLICY "Select co-member or admin profiles" ON public.profiles
FOR SELECT USING (
  role = 'admin'
  OR EXISTS (
    SELECT 1 FROM public.project_members pm_self
    JOIN public.project_members pm_other ON pm_other.project_id = pm_self.project_id
    WHERE pm_self.profile_id = auth.uid()
      AND pm_other.profile_id = public.profiles.id
  )
);

-- Fix 2: the notifications bell subscribes to postgres_changes INSERT on
-- activity_log, but the table was never added to the realtime publication,
-- so it only ever loads once on mount and never updates live.
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
