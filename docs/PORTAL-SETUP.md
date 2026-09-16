# HexaLogic Portal Setup

## 1. Environment Variables
You need to provide the following variables in a `.env.local` file at the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Resend Email Configuration (Phase 4)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="HexaLogic <portal@hexalogic.com>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Domain Verification (Resend)
For emails to land in inboxes rather than spam folders in production, you must verify your sending domain (`hexalogic.com` or similar) in the Resend dashboard.
1. Add the domain in Resend.
2. Add the provided DNS records (SPF, DKIM, DMARC) to your domain registrar (e.g., Cloudflare, Vercel, Route53).
3. Wait for verification to complete before sending production emails.

## 2. Database Migrations
Deploy the database schema via the Supabase CLI:

```bash
supabase db push
```

*Note: This will execute the `supabase/migrations/0001_portal.sql` migration, creating the tables, RLS policies, and RPCs.*

## 3. Storage Setup
The migration automatically provisions the `project-media` bucket and configures its RLS policies.

## 4. Admin Seeding
To access the `/admin` area, you need an admin account. 
Since public signups are disabled, you must use the seed script to create the initial admin user.

Run the following command from the project root:

```bash
npx tsx scripts/seed-admin.ts admin@yourdomain.com your-secure-password
```

This will securely use the `SUPABASE_SERVICE_ROLE_KEY` to bypass Auth limitations, create the user with `email_confirm: true`, and inject them into the `profiles` table with the `role = 'admin'`.

## 5. First Login
- Navigate to `/portal/login`
- Login with the admin credentials. 
- The middleware will allow access to `/admin/dashboard` based on the `admin` role in the `profiles` table.

## 6. Vercel Production Deployment
When deploying to Vercel, ensure the following environment variables are strictly configured:

1. Under the **Settings > Environment Variables** tab, add all keys from `.env.local`.
2. Ensure `NEXT_PUBLIC_SITE_URL` reflects the production domain (e.g. `https://hexalogic.com`) in the **Production** environment, and the automatically generated Vercel URLs for the **Preview** environment.
3. Keep `SUPABASE_SERVICE_ROLE_KEY` restricted to the **Production** and **Preview** environments (do NOT check Development if you run local tests without it).
