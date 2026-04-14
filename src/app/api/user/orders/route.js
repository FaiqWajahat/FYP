import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getAdminSupabase = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() { return []; },
        setAll() { },
      },
    }
  );
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const cookieStore = await cookies();
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) { },
        },
      }
    );

    const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
    
    if (authError || !session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const adminSupabase = getAdminSupabase();

    let query = adminSupabase
      .from('orders')
      .select(`
        *,
        invoices (id, status, amount, milestone_type)
      `)
      .eq('user_id', userId);

    if (id) {
       query = query.eq('id', id).single();
    } else {
       query = query.order('created_at', { ascending: false });
    }

    const { data: result, error: fetchError } = await query;

    if (fetchError) {
      throw fetchError;
    }

    if (id) {
        return NextResponse.json({ success: true, order: result });
    }
    return NextResponse.json({ success: true, orders: result || [] });
  } catch (err) {
    console.error("User Orders Fetch Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
