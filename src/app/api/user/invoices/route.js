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

const getUserSession = async () => {
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
    throw new Error('Unauthorized');
  }
  return session.user;
};

export async function GET(request) {
  try {
    const user = await getUserSession();
    const adminSupabase = getAdminSupabase();

    const { data: invoices, error } = await adminSupabase
      .from('invoices')
      .select(`
        *,
        orders:order_id (display_id, product_name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, invoices: invoices || [] });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error("User Invoices GET Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getUserSession();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      throw new Error("Invoice ID and status are required");
    }

    if (!['approved', 'rejected'].includes(status)) {
       throw new Error("Invalid status update requested");
    }

    const adminSupabase = getAdminSupabase();

    const { data: invoice, error: fetchError } = await adminSupabase
      .from('invoices')
      .select('user_id, status, order_id, milestone_type')
      .eq('id', id)
      .single();
    
    if (fetchError || !invoice || invoice.user_id !== user.id) {
       return NextResponse.json({ success: false, error: 'Unauthorized or invoice not found' }, { status: 403 });
    }

    if (invoice.status === 'paid') {
       return NextResponse.json({ success: false, error: 'Cannot modify a paid invoice' }, { status: 400 });
    }

    const { error: updateError } = await adminSupabase
      .from('invoices')
      .update({ status: status })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    const { data: currentOrder } = await adminSupabase
      .from('orders')
      .select('activity_log')
      .eq('id', invoice.order_id)
      .single();

    if (currentOrder) {
      const existingLog = Array.isArray(currentOrder.activity_log) ? currentOrder.activity_log : [];
      const now = new Date().toISOString();
      const actionMsg = status === 'approved' ? 'User approved invoice.' : 'User rejected invoice.';
      const mergedLog = [...existingLog, {
         date: now,
         type: 'payment',
         message: actionMsg,
         user: 'Customer'
      }];

      await adminSupabase.from('orders').update({ activity_log: mergedLog }).eq('id', invoice.order_id);
    }

    return NextResponse.json({ success: true, status: status });
  } catch (err) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    console.error("User Invoices PATCH Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
