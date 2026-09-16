-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  company text,
  avatar_url text,
  role text CHECK (role IN ('client', 'admin')),
  timezone text DEFAULT 'UTC',
  email_prefs jsonb DEFAULT '{"every_update":true}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('planning','in_progress','review','on_hold','completed','archived')) DEFAULT 'planning',
  progress int CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
  start_date date,
  due_date date,
  hours_logged numeric DEFAULT 0,
  access_revoked_at timestamptz NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_members table
CREATE TABLE public.project_members (
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('owner','viewer')) DEFAULT 'viewer',
  PRIMARY KEY (project_id, profile_id)
);

-- Create milestones table
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text CHECK (status IN ('pending','active','done')) DEFAULT 'pending',
  due_date date,
  position int DEFAULT 0,
  approval_status text CHECK (approval_status IN ('none','approved','changes_requested')) DEFAULT 'none',
  approved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at timestamptz
);

-- Create updates table
CREATE TABLE public.updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text,
  hours numeric DEFAULT 0,
  progress_after int CHECK (progress_after >= 0 AND progress_after <= 100),
  deleted_at timestamptz NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  update_id uuid NULL REFERENCES public.updates(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  body text NOT NULL,
  deleted_at timestamptz NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE public.ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  stars int CHECK (stars >= 1 AND stars <= 5),
  feedback text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(project_id, author_id)
);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create media table
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id uuid NULL REFERENCES public.updates(id) ON DELETE CASCADE,
  comment_id uuid NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  path text NOT NULL,
  kind text CHECK (kind IN ('image','video','file')),
  mime_type text,
  size_bytes bigint,
  caption text,
  created_at timestamptz DEFAULT now(),
  CHECK (update_id IS NOT NULL OR comment_id IS NOT NULL)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_member(p_project_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_members pm
    JOIN public.projects p ON p.id = pm.project_id
    WHERE pm.project_id = p_project_id 
      AND pm.profile_id = auth.uid()
      AND (p.access_revoked_at IS NULL OR p.access_revoked_at > now())
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.safe_cast_uuid(text_val text) RETURNS uuid AS $$
BEGIN
  RETURN text_val::uuid;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RPCs
CREATE OR REPLACE FUNCTION public.update_own_profile(
  p_full_name text DEFAULT NULL, 
  p_avatar_url text DEFAULT NULL, 
  p_timezone text DEFAULT NULL, 
  p_email_prefs jsonb DEFAULT NULL
) RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET full_name = COALESCE(p_full_name, full_name),
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      timezone = COALESCE(p_timezone, timezone),
      email_prefs = COALESCE(p_email_prefs, email_prefs)
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.update_own_profile TO authenticated;

CREATE OR REPLACE FUNCTION public.approve_milestone(p_milestone_id uuid, p_status text) RETURNS void AS $$
DECLARE
  v_project_id uuid;
  v_current_status text;
  v_milestone_status text;
BEGIN
  SELECT project_id, approval_status, status INTO v_project_id, v_current_status, v_milestone_status 
  FROM public.milestones WHERE id = p_milestone_id;

  IF NOT FOUND THEN RAISE EXCEPTION 'Milestone not found'; END IF;
  IF NOT public.is_member(v_project_id) THEN RAISE EXCEPTION 'Access denied'; END IF;
  
  -- Prevent approval of incomplete milestones
  IF v_milestone_status != 'done' THEN
    RAISE EXCEPTION 'Milestone must be completed before approval';
  END IF;

  -- Prevent client reversal
  IF v_current_status = 'approved' THEN
    RAISE EXCEPTION 'Milestone already approved; cannot be reversed by client';
  END IF;
  
  IF p_status NOT IN ('approved', 'changes_requested') THEN
    RAISE EXCEPTION 'Invalid approval status';
  END IF;

  UPDATE public.milestones 
  SET approval_status = p_status,
      approved_by = auth.uid(),
      approved_at = now()
  WHERE id = p_milestone_id;

  INSERT INTO public.activity_log (project_id, actor_id, event_type, payload, created_at)
  VALUES (v_project_id, auth.uid(), 'approval_given', jsonb_build_object('milestone_id', p_milestone_id, 'status', p_status), now());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.approve_milestone TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_own_comment(p_comment_id uuid) RETURNS void AS $$
DECLARE
  v_author_id uuid;
  v_created_at timestamptz;
BEGIN
  SELECT author_id, created_at INTO v_author_id, v_created_at 
  FROM public.comments WHERE id = p_comment_id;

  IF NOT FOUND THEN RAISE EXCEPTION 'Comment not found'; END IF;
  IF v_author_id != auth.uid() THEN RAISE EXCEPTION 'Access denied'; END IF;
  
  IF v_created_at < now() - interval '15 minutes' THEN
    RAISE EXCEPTION 'Comment cannot be deleted after 15 minutes';
  END IF;

  UPDATE public.comments SET deleted_at = now() WHERE id = p_comment_id AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.delete_own_comment TO authenticated;

-- RLS Policies

-- profiles
CREATE POLICY "Admin full access" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Select own row" ON public.profiles FOR SELECT USING (id = auth.uid());

-- project_members
CREATE POLICY "Admin full access" ON public.project_members FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own membership" ON public.project_members FOR SELECT USING (profile_id = auth.uid());

-- projects
CREATE POLICY "Admin full access" ON public.projects FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own projects" ON public.projects FOR SELECT USING (public.is_member(id));

-- milestones
CREATE POLICY "Admin full access" ON public.milestones FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own project milestones" ON public.milestones FOR SELECT USING (public.is_member(project_id));

-- updates
CREATE POLICY "Admin full access" ON public.updates FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own project updates" ON public.updates FOR SELECT USING (public.is_member(project_id));

-- comments
CREATE POLICY "Admin full access" ON public.comments FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own project comments" ON public.comments FOR SELECT USING (public.is_member(project_id));
CREATE POLICY "Client insert comments" ON public.comments FOR INSERT WITH CHECK (public.is_member(project_id) AND author_id = auth.uid());

-- ratings
CREATE POLICY "Admin full access" ON public.ratings FOR ALL USING (public.is_admin());
CREATE POLICY "Client insert own rating" ON public.ratings FOR INSERT WITH CHECK (public.is_member(project_id) AND author_id = auth.uid());
CREATE POLICY "Client update own rating (30 days)" ON public.ratings FOR UPDATE 
  USING (author_id = auth.uid() AND created_at > now() - interval '30 days')
  WITH CHECK (author_id = auth.uid());

-- activity_log
CREATE POLICY "Admin full access" ON public.activity_log FOR ALL USING (public.is_admin());
CREATE POLICY "Client select own project activity" ON public.activity_log FOR SELECT USING (public.is_member(project_id));

-- media
CREATE POLICY "Admin full access" ON public.media FOR ALL USING (public.is_admin());
CREATE POLICY "Client select media for their projects" ON public.media FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.updates u WHERE u.id = update_id AND public.is_member(u.project_id)
  ) OR EXISTS (
    SELECT 1 FROM public.comments c WHERE c.id = comment_id AND public.is_member(c.project_id)
  )
);
CREATE POLICY "Client insert media for their projects" ON public.media FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.comments c WHERE c.id = comment_id AND public.is_member(c.project_id) AND c.author_id = auth.uid()
  )
);

-- Storage bucket setup & RLS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-media', 'project-media', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admin full access to media" ON storage.objects FOR ALL USING (bucket_id = 'project-media' AND public.is_admin());

CREATE POLICY "Client select media for their projects" ON storage.objects FOR SELECT USING (
  bucket_id = 'project-media' AND 
  public.is_member( public.safe_cast_uuid((string_to_array(name, '/'))[1]) )
);

CREATE POLICY "Client upload media to their projects" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-media' AND 
  public.is_member( public.safe_cast_uuid((string_to_array(name, '/'))[1]) )
);
