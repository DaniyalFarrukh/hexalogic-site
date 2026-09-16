# RLS Security Audit Checklist

To guarantee data isolation across clients, run through this checklist with two dummy client accounts (`Client A`, `Client B`) and one admin account.

## Setup
1. Create "Project A" assigned to Client A.
2. Create "Project B" assigned to Client B.

## Checklist

### 1. Cross-Project Isolation
- [ ] Log in as Client A.
- [ ] Attempt to manually navigate to `localhost:3000/portal/project-b-slug`.
- [ ] **Expected**: A `404 Not Found` page is returned. No data or existence of the project is revealed.

### 2. Update Tampering
- [ ] Log in as Client A.
- [ ] In the browser console, execute a raw Supabase JS client call attempting to insert an update into Project A.
- [ ] **Expected**: Rejected. The RLS policy on `updates` restricts `INSERT` to Admins only.

### 3. Comment Manipulation
- [ ] Log in as Client A.
- [ ] Post a comment on Project A.
- [ ] In the browser console, attempt to `UPDATE` the comment's body via the Supabase client.
- [ ] **Expected**: Rejected. There is no `UPDATE` policy on the `comments` table.
- [ ] In the browser console, attempt to `DELETE` the comment via the raw `delete()` method.
- [ ] **Expected**: Rejected. There is no `DELETE` policy. Deletions must go through the `delete_own_comment` RPC, which enforces the 15-minute window rule.

### 4. Admin RPC Privilege Separation
- [ ] Log in as Client A.
- [ ] Attempt to call `publish_project_update` RPC directly via the Supabase client.
- [ ] **Expected**: Rejected with `not authorized`. The RPC checks `is_admin()` and blocks execution despite being `SECURITY DEFINER`.

### 5. Profile Tampering
- [ ] Log in as Client A.
- [ ] Attempt to `UPDATE` your own profile row, setting `role = 'admin'`.
- [ ] **Expected**: Rejected. There is no raw `UPDATE` policy on profiles. Profile changes must route through the `update_own_profile` RPC which explicitly whitelists only non-sensitive columns.
