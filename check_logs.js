
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: members, error: memError } = await supabase
    .from('project_members')
    .select('*')
    .eq('project_id', '4bee91d4-5447-4328-960b-4eb13b467585');
    
  console.log('Members:', members);
  
  const { data: msgs, error: msgError } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
    
  console.log('Message Error:', msgError);
  console.log('Messages:', msgs);
}

main();
