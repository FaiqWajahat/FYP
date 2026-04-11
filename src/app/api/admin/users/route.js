import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, full_name, role, phone, shipping_address, profile_image } = body

    // 1. Initialize Supabase with SERVICE ROLE KEY for Admin Privileges
    // NOTE: This must be done on the server (Route Handler)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // This key bypasses RLS and allows auth.admin
      {
        cookies: {
          getAll() { return [] },
          setAll() { },
        },
      }
    )

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (authError) throw authError

    // Small delay to ensure the database trigger (handle_new_user) finishes inserting the profile row
    await new Promise(resolve => setTimeout(resolve, 800));

    // 4. Initialize/Update the profile definitively (Upsert handles if trigger was slow/missing)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: full_name,
        role: role || 'user',
        phone: phone || '',
        profile_image: profile_image || '',
        shipping_address: shipping_address || {},
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err) {
    console.error("Admin User Creation Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

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

    // Fetch users for the client list (safe selection of verified columns)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, email')
      .order('full_name');

    if (error) throw error;

    return NextResponse.json({ success: true, users: data });
  } catch (err) {
    console.error("Admin User Fetch Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
