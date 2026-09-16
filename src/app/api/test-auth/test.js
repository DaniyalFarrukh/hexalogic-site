
const { createClient } = require('@supabase/supabase-js');
(async () => {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data, error } = await sb.auth.signInWithPassword({ email: 'admin@hexalogic.com', password: 'AdminPassword123!' });
  if (error) throw error;
  
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0];
  const cookieName = 'sb-' + projectId + '-auth-token';
  const cookieValue = JSON.stringify([data.session.access_token, data.session.refresh_token, null, null, null]);
  
  const res = await fetch('http://localhost:3000/api/test-auth', {
    headers: {
      cookie: cookieName + '=' + encodeURIComponent(cookieValue)
    }
  });
  console.log(res.status);
  console.log(await res.text());
})();

