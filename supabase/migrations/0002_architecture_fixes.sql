-- 1. admin_read_state Table
CREATE TABLE public.admin_read_state (
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    last_read_at timestamptz DEFAULT now(),
    PRIMARY KEY (project_id, admin_id)
);

ALTER TABLE public.admin_read_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can select own read state" ON public.admin_read_state 
FOR SELECT USING (is_admin() AND admin_id = auth.uid());

CREATE POLICY "Admins can insert/update own read state" ON public.admin_read_state 
FOR ALL USING (is_admin() AND admin_id = auth.uid()) WITH CHECK (is_admin() AND admin_id = auth.uid());

-- 2. safe_cast_uuid Helper
CREATE OR REPLACE FUNCTION public.safe_cast_uuid(text_val text)
RETURNS uuid AS $$
BEGIN
    RETURN text_val::uuid;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Recreate SECURITY DEFINER functions with search_path

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_member(p_project_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.project_members 
        WHERE project_id = p_project_id AND profile_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP FUNCTION IF EXISTS public.update_own_profile;
CREATE OR REPLACE FUNCTION public.update_own_profile(p_full_name text, p_avatar_url text, p_timezone text, p_email_prefs jsonb)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET full_name = p_full_name,
        avatar_url = p_avatar_url,
        timezone = p_timezone,
        email_prefs = p_email_prefs
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
GRANT EXECUTE ON FUNCTION public.update_own_profile TO authenticated;

CREATE OR REPLACE FUNCTION public.delete_own_comment(p_comment_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.comments
    SET deleted_at = now()
    WHERE id = p_comment_id 
      AND author_id = auth.uid() 
      AND deleted_at IS NULL
      AND created_at > now() - interval '15 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
GRANT EXECUTE ON FUNCTION public.delete_own_comment TO authenticated;

DROP FUNCTION IF EXISTS public.approve_milestone;
CREATE OR REPLACE FUNCTION public.approve_milestone(p_milestone_id uuid, p_decision text)
RETURNS void AS $$
DECLARE
    v_project_id uuid;
    v_status text;
    v_approval_status text;
BEGIN
    SELECT project_id, status, approval_status 
    INTO v_project_id, v_status, v_approval_status 
    FROM public.milestones WHERE id = p_milestone_id;

    IF NOT is_member(v_project_id) THEN
        RAISE EXCEPTION 'not authorized';
    END IF;

    IF v_status <> 'done' THEN
        RAISE EXCEPTION 'milestone is not done';
    END IF;

    IF v_approval_status = 'approved' THEN
        RAISE EXCEPTION 'already approved';
    END IF;

    IF p_decision NOT IN ('approved', 'changes_requested') THEN
        RAISE EXCEPTION 'invalid decision';
    END IF;

    UPDATE public.milestones 
    SET approval_status = p_decision,
        approved_by = auth.uid(),
        approved_at = now()
    WHERE id = p_milestone_id;

    INSERT INTO activity_log (project_id, actor_id, event_type, payload)
    VALUES (v_project_id, auth.uid(), 'milestone_' || p_decision, jsonb_build_object('milestone_id', p_milestone_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
GRANT EXECUTE ON FUNCTION public.approve_milestone TO authenticated;

DROP FUNCTION IF EXISTS public.publish_project_update;
CREATE OR REPLACE FUNCTION public.publish_project_update(
    p_project_id uuid,
    p_title text,
    p_body text,
    p_hours numeric,
    p_progress integer,
    p_media jsonb 
) RETURNS uuid AS $$
DECLARE
    v_update_id uuid;
    v_media_record jsonb;
    v_old_progress integer;
    v_safe_hours numeric;
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'not authorized';
    END IF;

    v_safe_hours := GREATEST(p_hours, 0::numeric);

    INSERT INTO updates (project_id, author_id, title, body, hours)
    VALUES (p_project_id, auth.uid(), p_title, p_body, v_safe_hours)
    RETURNING id INTO v_update_id;

    IF jsonb_array_length(p_media) > 0 THEN
        FOR v_media_record IN SELECT * FROM jsonb_array_elements(p_media)
        LOOP
            INSERT INTO media (update_id, path, kind, caption, size_bytes, mime_type)
            VALUES (
                v_update_id, 
                v_media_record->>'path', 
                v_media_record->>'kind', 
                v_media_record->>'caption',
                (v_media_record->>'size_bytes')::bigint,
                v_media_record->>'mime_type'
            );
        END LOOP;
    END IF;

    SELECT progress INTO v_old_progress FROM projects WHERE id = p_project_id FOR UPDATE;
    
    UPDATE projects 
    SET progress = p_progress, 
        hours_logged = hours_logged + v_safe_hours,
        updated_at = now()
    WHERE id = p_project_id;

    IF v_old_progress IS DISTINCT FROM p_progress THEN
        INSERT INTO activity_log (project_id, actor_id, event_type, payload)
        VALUES (p_project_id, auth.uid(), 'progress_changed', jsonb_build_object('old', v_old_progress, 'new', p_progress));
    END IF;
    
    INSERT INTO activity_log (project_id, actor_id, event_type)
    VALUES (p_project_id, auth.uid(), 'update_posted');

    RETURN v_update_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
GRANT EXECUTE ON FUNCTION public.publish_project_update TO authenticated;


-- 4. Replace RLS Policies

-- Profiles
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Update own row" ON public.profiles;
CREATE POLICY "Select own profile or admin" ON public.profiles
FOR SELECT USING (id = auth.uid() OR is_admin());
-- (No direct UPDATE on profiles, handled via update_own_profile)

-- Project Members
DROP POLICY IF EXISTS "Enable read access for all users" ON public.project_members;
CREATE POLICY "Select own memberships or admin" ON public.project_members
FOR SELECT USING (profile_id = auth.uid() OR is_admin());
CREATE POLICY "Admins full access to project_members" ON public.project_members
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Ratings
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ratings;
CREATE POLICY "Select own ratings or admin" ON public.ratings
FOR SELECT USING (author_id = auth.uid() OR is_admin());
CREATE POLICY "Insert own rating" ON public.ratings
FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "Update own rating within 30 days" ON public.ratings
FOR UPDATE USING (author_id = auth.uid() AND created_at > now() - interval '30 days')
WITH CHECK (author_id = auth.uid() AND created_at > now() - interval '30 days');
CREATE POLICY "Admins full access to ratings" ON public.ratings
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Activity Log
DROP POLICY IF EXISTS "Enable read access for all users" ON public.activity_log;
CREATE POLICY "Select activity from own projects" ON public.activity_log
FOR SELECT USING (is_member(project_id) OR is_admin());

-- Media
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media;
CREATE POLICY "Select media from own projects" ON public.media
FOR SELECT USING (
    (update_id IS NOT NULL AND is_member((SELECT project_id FROM updates WHERE id = media.update_id))) OR
    (comment_id IS NOT NULL AND is_member((SELECT project_id FROM comments WHERE id = media.comment_id))) OR
    is_admin()
);

-- Fix storage bucket file size limit (100MB)
UPDATE storage.buckets
SET file_size_limit = 104857600
WHERE id = 'project-media';

-- Recreate storage object policies with safe_cast_uuid
DROP POLICY IF EXISTS "Allow select for members" ON storage.objects;
DROP POLICY IF EXISTS "Allow insert for admins" ON storage.objects;

CREATE POLICY "Allow select for members" ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-media' 
  AND (
    is_admin() OR is_member(safe_cast_uuid(split_part(name, '/', 1)))
  )
);

CREATE POLICY "Allow insert for admins" ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-media' 
  AND is_admin()
);

-- Note: No authenticated execute grant for sweep_orphaned_media, omitted intentionally.
