import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testRLS() {
  const { data, error } = await supabase.from('messages').select('*').limit(1);
  if (error) {
    console.error("RLS is enabled or error:", error);
  } else {
    console.log("RLS is disabled or allows anon select. Data:", data);
  }
}

testRLS();
