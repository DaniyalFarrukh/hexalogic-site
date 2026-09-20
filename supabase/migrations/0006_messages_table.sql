-- Create messages table

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin full access" ON public.messages FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own project messages" ON public.messages FOR SELECT USING (public.is_member(project_id));
CREATE POLICY "Client insert own project messages" ON public.messages FOR INSERT WITH CHECK (public.is_member(project_id) AND sender_id = auth.uid());

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;