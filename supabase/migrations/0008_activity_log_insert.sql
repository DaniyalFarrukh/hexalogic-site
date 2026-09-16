-- Add INSERT policy for clients on activity_log
CREATE POLICY "Client insert own project activity" ON public.activity_log 
FOR INSERT WITH CHECK (public.is_member(project_id) AND actor_id = auth.uid());
