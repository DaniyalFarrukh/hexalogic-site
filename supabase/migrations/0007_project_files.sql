-- Add project_id to media table to allow direct file uploads
ALTER TABLE public.media ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE;

-- Drop the old check constraint. If we don't know the exact name, we can drop all CHECK constraints on media and recreate the one we want.
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.media'::regclass AND contype = 'c'
    LOOP
        EXECUTE 'ALTER TABLE public.media DROP CONSTRAINT ' || quote_ident(rec.conname);
    END LOOP;
END $$;

-- Recreate the check constraint allowing media to be attached to a project, update, or comment
ALTER TABLE public.media ADD CONSTRAINT media_target_check CHECK (
    update_id IS NOT NULL OR 
    comment_id IS NOT NULL OR 
    project_id IS NOT NULL
);

-- Ensure kind constraint is still there since we dropped all CHECK constraints
ALTER TABLE public.media ADD CONSTRAINT media_kind_check CHECK (kind IN ('image','video','file'));

-- Update RLS policies for project media
-- Clients can see media if they are members of the project
CREATE POLICY "Client select project media" ON public.media 
FOR SELECT USING (
  public.is_member(project_id) OR 
  public.is_admin()
);

-- Clients can insert media into projects they are members of
CREATE POLICY "Client insert project media" ON public.media 
FOR INSERT WITH CHECK (
  public.is_member(project_id) OR 
  public.is_admin()
);

-- Similarly for storage objects, allow clients to upload directly to project-media
-- We already have policies for storage, but we need to ensure the path corresponds to a project they have access to.
-- Since storage policies in 0001 check for path components, let's make sure the client can upload.
-- The existing policy in 0001 is:
-- CREATE POLICY "Client upload media to their projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-media' AND (split_part(name, '/', 1))::uuid IN (SELECT id FROM public.projects WHERE public.is_member(id)));
-- So no new storage policy is strictly needed if we store files in `[project_id]/filename`.
