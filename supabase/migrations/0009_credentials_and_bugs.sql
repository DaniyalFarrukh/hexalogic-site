-- Create credentials table
CREATE TABLE public.credentials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  url text,
  username text NOT NULL,
  password text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for credentials
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Policies for credentials
CREATE POLICY "Users can view credentials for their projects"
  ON public.credentials FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert credentials for their projects"
  ON public.credentials FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update credentials for their projects"
  ON public.credentials FOR UPDATE
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete credentials for their projects"
  ON public.credentials FOR DELETE
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create bugs table
CREATE TABLE public.bugs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  reporter_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
  severity text DEFAULT 'medium' NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for bugs
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

-- Policies for bugs
CREATE POLICY "Users can view bugs for their projects"
  ON public.bugs FOR SELECT
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can insert bugs for their projects"
  ON public.bugs FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update bugs for their projects"
  ON public.bugs FOR UPDATE
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can delete bugs for their projects"
  ON public.bugs FOR DELETE
  USING (
    project_id IN (
      SELECT project_id FROM public.project_members WHERE profile_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
