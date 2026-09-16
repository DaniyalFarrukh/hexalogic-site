-- Phase 5: Comments & Approvals schema updates

-- 1. Add milestone_id to comments
ALTER TABLE public.comments ADD COLUMN milestone_id uuid NULL REFERENCES public.milestones(id) ON DELETE CASCADE;

-- 2. Ensure comment is attached to either an update or a milestone (or neither if project-level, but the prompt says to updates and milestones, so let's enforce at least one is NOT NULL or both are NULL)
-- Actually, the requirement says "Add commenting system to updates and milestones."
-- We can enforce that exactly one is NOT NULL if it's attached, or both are NULL if it's a general project comment.
ALTER TABLE public.comments ADD CONSTRAINT comments_target_check CHECK (
  (update_id IS NOT NULL AND milestone_id IS NULL) OR 
  (update_id IS NULL AND milestone_id IS NOT NULL) OR
  (update_id IS NULL AND milestone_id IS NULL)
);

-- 3. Update media RLS policies to allow reading/inserting if attached to a milestone comment
-- Media table already has:
-- EXISTS (SELECT 1 FROM public.updates u WHERE u.id = update_id AND public.is_member(u.project_id))
-- OR EXISTS (SELECT 1 FROM public.comments c WHERE c.id = comment_id AND public.is_member(c.project_id))
-- Since the `comments` table already has `project_id`, the existing `media` policies using `c.project_id` STILL WORK perfectly for milestone comments, because a comment on a milestone still has the `project_id` populated!
-- Let's just double check the media policy in 0001_portal.sql:
-- "Client select media for their projects" ON public.media FOR SELECT USING (
--   EXISTS ( SELECT 1 FROM public.updates u WHERE u.id = update_id AND public.is_member(u.project_id) ) 
--   OR EXISTS ( SELECT 1 FROM public.comments c WHERE c.id = comment_id AND public.is_member(c.project_id) )
-- )
-- Yes, it works! No media RLS changes needed!
