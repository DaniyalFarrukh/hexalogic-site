# Portal Implementation Plan (Phases 1-6)

## Scope Summary
A private per-client project portal where clients can log in via a unique URL to view their project status.
**Features**:
- Project status and progress bar
- Milestones tracking
- Update feed (with images/video)
- Media gallery
- Time logged and due dates
- Client commenting (text and screenshot uploads)
- Milestone approval/change requests
- Post-project rating system
- Admin dashboard to create clients/projects, post updates, manage progress
- Email notifications (via Resend/Nodemailer) for client updates and admin alerts

## Route Structure
### Client Facing
- `/portal/login` - Client authentication (magic link or credentials)
- `/portal/[clientId]/project/[projectId]` - Main dashboard for the client project
- `/portal/[clientId]/project/[projectId]/milestones` - Detailed milestones view
- `/portal/[clientId]/project/[projectId]/gallery` - Media gallery

### Admin Facing
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Overview of all clients and projects
- `/admin/clients/new` - Create a new client
- `/admin/projects/[projectId]` - Manage specific project (updates, progress)

## Phase-by-Phase Plan

### Phase 1: Database & Schema Setup
- Set up Supabase/PostgreSQL schema for `clients`, `projects`, `milestones`, `updates`, `comments`, `media`.
- Define Typescript interfaces for the database schema in `src/types/database.ts`.

### Phase 2: Authentication & Admin Foundation
- Implement auth (Supabase Auth).
- Create basic layout shells for `/portal` and `/admin` using styles defined in `portal.md`.
- Build the Admin Dashboard to create clients and projects.

### Phase 3: Client Portal Core UI
- Develop the main client project view (`/portal/[clientId]/project/[projectId]`).
- Implement the status indicator, progress bar, and basic milestone list.
- Use existing UI tokens (`#141417` cards, `#FF7324` accents).

### Phase 4: Update Feed & Media Management
- Implement the project update feed component.
- Add support for media uploads (Supabase Storage) for the gallery and update feed.
- Admin upload functionality and client viewing functionality.

### Phase 5: Interactive Features (Comments & Approvals)
- Add commenting system to updates and milestones.
- Implement screenshot upload for comments.
- Add "Approve" or "Request Changes" workflows on milestones.
- Implement the end-of-project rating system.

### Phase 6: Email Notifications & Polish
- Integrate Resend/Nodemailer for transactional emails.
- Trigger emails to clients when updates are posted.
- Trigger emails to admin when clients comment or approve milestones.
- Final UI polish, ensuring strict adherence to `MASTER.md` tokens and removing any layout bugs.
