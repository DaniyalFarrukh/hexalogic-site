# HexaLogic Tech Solutions

Company website and client portal for HexaLogic, built with Next.js 16, Tailwind CSS and Supabase.

Live site: https://www.hexalogictechandsolutions.com

## What is in this repo

- `src/app/(marketing)` – public website (home, services, case studies, about, contact, legal pages)
- `src/app/admin` – admin console for managing clients, projects, milestones and updates
- `src/app/portal` – client portal where clients follow progress, message the team and share files
- `src/lib` – shared config (`site.ts` holds the domain and contact details), services data, helpers
- `supabase/migrations` – database schema and row-level security policies

## Running locally

```bash
npm install
npm run dev
```

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://www.hexalogictechandsolutions.com
RESEND_API_KEY=
EMAIL_FROM=
GMAIL_USER=
GMAIL_APP_PASSWORD=
CRON_SECRET=
```

`npm run lint` and `npm run build` must both pass; CI runs them on every push.

## Changes made in September 2026

A full audit of the site, admin and portal, followed by fixes:

**Security**
- Removed passwords and debug files that had been committed to the repo
- Fixed the password reset flow (reset links now sign the user in)
- Saving milestones no longer deletes their comments
- Contact form protected against spam and unsafe input

**Public website**
- Services pages created and linked from the menu and footer (links used to go nowhere)
- New domain set up for SEO: sitemap, robots, page titles, social previews
- Custom 404 page, fixed footer links, real content instead of placeholders
- Faster hero video with MP4 fallback, cleaner animations on mobile

**Admin and client portal**
- Client project pages now have the sidebar, header and mobile navigation
- Everything uses one light theme (some pages were dark on light)
- Dashboard shows real activity instead of dummy data
- Milestones support "in progress" and due dates; timeline shows real data
- Chat, files, credentials, bugs and settings pages cleaned up and made usable on phones

**Layout**
- Spacing, text sizes and image ratios tuned for both phone and desktop

**Code quality**
- Old template files and unused code removed
- ESLint errors reduced from 91 to 0
