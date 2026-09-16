import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  // Protect route if CRON_SECRET is configured
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET) {
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Call the RPC to sweep orphans. Note: the RPC returns a JSON array of deleted paths if written that way,
    // or just executes successfully.
    const { data, error } = await supabaseAdmin.rpc('sweep_orphaned_media')

    if (error) throw error

    return NextResponse.json({ success: true, swept: data || [] })
  } catch (err: any) {
    console.error('Failed to sweep orphaned media:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
