-- Phase 5.1: Sweep Orphaned Media RPC

-- This function sweeps the 'project-media' storage bucket for files
-- that are older than 24 hours and have no corresponding record in public.media.
-- It returns an array of paths that were deleted.
CREATE OR REPLACE FUNCTION public.sweep_orphaned_media()
RETURNS text[] AS $$
DECLARE
  deleted_paths text[];
BEGIN
  -- We delete directly from storage.objects.
  -- Supabase storage triggers a background worker on delete to clean up the actual S3 objects.
  DELETE FROM storage.objects
  WHERE bucket_id = 'project-media'
  AND created_at < (now() - interval '24 hours')
  AND NOT EXISTS (
    SELECT 1 FROM public.media WHERE public.media.path = storage.objects.name
  )
  RETURNING name INTO deleted_paths;

  RETURN deleted_paths;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Note: Intentionally omitting GRANT EXECUTE TO authenticated / anon.
-- This function is only meant to be called by the service role key via the cron API endpoint.
