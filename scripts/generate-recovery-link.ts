import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load .env.local for local execution
dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hexalogictechandsolutions.com'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars in .env.local")
  process.exit(1)
}

const targetEmail = process.argv[2]

if (!targetEmail) {
  console.error("Usage: npx tsx scripts/generate-recovery-link.ts <email>")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function generateLink() {
  console.log(`Generating recovery link for: ${targetEmail}...`)
  
  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: targetEmail,
    options: {
      redirectTo: `${SITE_URL}/auth/confirm?next=/portal/reset-password`
    }
  })

  if (error) {
    console.error('Error generating link:', error.message)
    process.exit(1)
  }

  console.log('\n✅ Success! Here is your password reset link (bypasses email sending limits):')
  console.log('\n======================================================')
  console.log(data.properties?.action_link)
  console.log('======================================================\n')
  console.log('Open this link in your browser to test the flow.')
}

generateLink().catch(console.error)
