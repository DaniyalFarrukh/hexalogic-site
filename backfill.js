const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: messages } = await supabase.from('messages').select('*');
  const { data: logs } = await supabase.from('activity_log').select('*').eq('event_type', 'message_sent');
  
  const existingPayloads = logs.map(l => l.payload.message_id);
  
  for (const msg of messages) {
    if (!existingPayloads.includes(msg.id)) {
      console.log('Backfilling message:', msg.id);
      await supabase.from('activity_log').insert({
        project_id: msg.project_id,
        actor_id: msg.sender_id,
        event_type: 'message_sent',
        payload: { message_id: msg.id },
        created_at: msg.created_at
      });
    }
  }
  console.log('Done!');
}

main();
