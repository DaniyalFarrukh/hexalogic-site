-- Create a view for Client Profiles
CREATE OR REPLACE VIEW public.client_profiles AS
SELECT *
FROM public.profiles
WHERE role = 'client';

-- Create a view for Admin Profiles
CREATE OR REPLACE VIEW public.admin_profiles AS
SELECT *
FROM public.profiles
WHERE role = 'admin';

-- Set security_invoker so that the underlying RLS policies on the 'profiles' table
-- are respected when querying these views via the API.
ALTER VIEW public.client_profiles SET (security_invoker = true);
ALTER VIEW public.admin_profiles SET (security_invoker = true);
