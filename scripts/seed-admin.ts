import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars")
  process.exit(1)
}

const adminEmail = process.argv[2]
const adminPassword = process.argv[3]

if (!adminEmail || !adminPassword) {
  console.error("Usage: npx tsx scripts/seed-admin.ts <email> <password>")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function seedAdmin() {
  console.log(`Creating admin user: ${adminEmail}`)
  
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { force_password_change: false } // Admins don't need this on seed
  })

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('User already exists in auth.users')
      // Try to get user id to ensure profile exists
      // We can't fetch by email easily without an API, but we can assume it's created
    } else {
      console.error('Error creating user:', authError)
      process.exit(1)
    }
  }

  const userId = authData?.user?.id

  if (!userId) {
    console.log("Could not obtain user ID (maybe already exists). Exiting.")
    process.exit(1)
  }

  // 2. Ensure profile exists and role is admin
  // Wait for trigger (if any) or just upsert
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId,
      role: 'admin',
      full_name: 'System Admin',
    }, { onConflict: 'id' })

  if (profileError) {
    console.error('Error setting admin role in profiles:', profileError)
    process.exit(1)
  }

  console.log(`Successfully created admin user: ${adminEmail}`)
}

seedAdmin().catch(console.error)
