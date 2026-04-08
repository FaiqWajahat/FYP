import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          getAll() { return [] },
          setAll() { },
        },
      }
    )

    // 1. List ALL users from Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const results = [];
    
    // 2. For each user, ensure a profile exists
    for (const user of users) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create missing profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
            role: user.user_metadata?.role || 'user',
            created_at: user.created_at
          });
        
        results.push({ 
          email: user.email, 
          status: insertError ? `Error: ${insertError.message}` : "Profile Created" 
        });
      } else {
        results.push({ email: user.email, status: "Already Exists" });
      }
    }

    return NextResponse.json({ 
      auth_user_count: users.length,
      actions: results
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
