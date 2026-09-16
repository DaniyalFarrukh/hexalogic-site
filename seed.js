const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seed() {
  console.log('Fetching users...')
  const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) {
    console.error('Error listing users:', listError)
    return
  }

  let adminUser = usersData.users.find(u => u.email === 'admin@hexalogic.com')
  if (!adminUser) {
    console.log('Creating admin user...')
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@hexalogic.com',
      password: 'AdminPassword123!',
      email_confirm: true,
      user_metadata: { force_password_change: false }
    })
    if (createError) throw createError
    adminUser = authData.user

    console.log('Creating admin profile...')
    await supabaseAdmin.from('profiles').insert({
      id: adminUser.id,
      full_name: 'System Admin',
      company: 'Hexalogic',
      role: 'admin'
    })
    console.log('Admin user created.')
  } else {
    console.log('Admin user already exists.')
    // Let's reset the password just in case
    await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
      password: 'AdminPassword123!',
      user_metadata: { force_password_change: false }
    })
  }

  let clientUser = usersData.users.find(u => u.email === 'client@example.com')
  if (!clientUser) {
    console.log('Creating client user...')
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'client@example.com',
      password: 'ClientPassword123!',
      email_confirm: true,
      user_metadata: { force_password_change: false }
    })
    if (createError) throw createError
    clientUser = authData.user

    console.log('Creating client profile...')
    await supabaseAdmin.from('profiles').insert({
      id: clientUser.id,
      full_name: 'Test Client',
      company: 'Acme Corp',
      role: 'client'
    })
    console.log('Client user created.')
  } else {
    console.log('Client user already exists.')
    await supabaseAdmin.auth.admin.updateUserById(clientUser.id, {
      password: 'ClientPassword123!',
      user_metadata: { force_password_change: false }
    })
  }

  // Create a project
  const { data: projects } = await supabaseAdmin.from('projects').select('id').eq('slug', 'acme-test')
  if (!projects || projects.length === 0) {
    console.log('Creating project...')
    const { data: newProject, error: projectError } = await supabaseAdmin.from('projects').insert({
      title: 'Acme Website Redesign',
      slug: 'acme-test',
      description: 'Test project for testing the portal',
      status: 'in_progress',
      progress: 50
    }).select('id').single()

    if (projectError) throw projectError

    console.log('Adding members...')
    await supabaseAdmin.from('project_members').insert([
      { project_id: newProject.id, profile_id: adminUser.id, role: 'viewer' },
      { project_id: newProject.id, profile_id: clientUser.id, role: 'owner' }
    ])

    console.log('Adding milestones...')
    await supabaseAdmin.from('milestones').insert([
      { project_id: newProject.id, title: 'Discovery', description: 'Initial requirements', position: 1, status: 'done' },
      { project_id: newProject.id, title: 'Design', description: 'Design phase', position: 2, status: 'in_progress' }
    ])

    console.log('Project created.')
  } else {
    console.log('Project already exists.')
  }

  console.log('Seed complete!')
  console.log('=========================')
  console.log('Admin: admin@hexalogic.com / AdminPassword123!')
  console.log('Client: client@example.com / ClientPassword123!')
  console.log('=========================')
}

seed().catch(console.error)
