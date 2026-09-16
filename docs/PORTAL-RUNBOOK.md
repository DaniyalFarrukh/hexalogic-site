# HexaLogic Portal Runbook

This guide covers daily operations for the portal admin.

## 1. Onboarding a New Client

1. **Create the Project & Client**: Navigate to `/admin/new`.
2. **Fill Details**: Enter the client's email, name, and project specifics.
3. **Submit**: Submitting this form automatically securely provisions a new user via Supabase Auth, seeds the project structure, assigns `owner` role, and dispatches the Welcome email.

## 2. Posting an Update

1. **Navigate**: Go to the project dashboard in `/admin/[slug]`.
2. **Draft**: In the "Post Update" widget, fill out the update title, hours logged, and body text.
3. **Attachments**: Click the attachment icon to select screenshots or videos.
4. **Publish**: Clicking "Post Update" creates the DB records, bulk-uploads media, and triggers the Resend `new-update` template to all project members.

## 3. Requesting Approvals

1. **Milestones**: Under the Milestones tab in `/admin/[slug]`, drag-and-drop to reorder, or edit existing milestones.
2. **Mark as Done**: Once a milestone is completed, change its status to `done`.
3. **Notification**: This automatically triggers the `milestone-done` email to the client, prompting them to log in and approve.

## 4. Revoking Access

1. Navigate to `/admin/[slug]`.
2. Locate the "Team Members" list.
3. Click the **Remove** button next to the client's name.
4. This instantly deletes their `project_members` row, severing RLS access. Even if their session is active, all data queries will return `notFound()`.

## 5. Handling Email Failures

If you notice a client didn't receive an update:
1. Verify the client's email in Supabase Auth.
2. Check the Resend dashboard logs for bounces or spam complaints.
3. If Resend indicates delivery but the client didn't see it, it is likely in their spam folder due to domain reputation. Remind them to whitelist `portal@hexalogic.com`.
4. Ensure `NEXT_PUBLIC_SITE_URL` in your `.env.local` accurately points to your production domain so links in the email function correctly.
