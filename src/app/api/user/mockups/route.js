import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getAdminSupabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );

const getUserSession = async () => {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session?.user) throw new Error('Unauthorized');
  return session.user;
};

// ─── GET — fetch authenticated user's mockups ─────────────────────
export async function GET() {
  try {
    const user = await getUserSession();
    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from('mockups')
      .select(`
        *,
        orders:order_id (id, display_id, product_name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, mockups: data || [] });
  } catch (err) {
    if (err.message === 'Unauthorized')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    console.error('User Mockups GET Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── PATCH — user approves or rejects a mockup ───────────────────
export async function PATCH(request) {
  try {
    const user = await getUserSession();
    const body = await request.json();
    const { id, status, client_feedback } = body;

    if (!id || !status) throw new Error('Mockup ID and status are required');
    if (!['approved', 'rejected'].includes(status))
      throw new Error('Invalid status. Must be approved or rejected');

    const supabase = getAdminSupabase();

    // Verify ownership
    const { data: mockup, error: fetchErr } = await supabase
      .from('mockups')
      .select('user_id, status, order_id')
      .eq('id', id)
      .single();

    if (fetchErr || !mockup || mockup.user_id !== user.id)
      return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 403 });

    if (mockup.status !== 'pending')
      return NextResponse.json({ success: false, error: 'Only pending mockups can be actioned' }, { status: 400 });

    const { data: updated, error: updErr } = await supabase
      .from('mockups')
      .update({ status, client_feedback: client_feedback || null })
      .eq('id', id)
      .select()
      .single();

    if (updErr) throw updErr;

    // Append to order activity log
    if (mockup.order_id) {
      const { data: ord } = await supabase
        .from('orders')
        .select('activity_log')
        .eq('id', mockup.order_id)
        .single();

      const log = Array.isArray(ord?.activity_log) ? ord.activity_log : [];
      const emoji = status === 'approved' ? '✅' : '❌';
      await supabase
        .from('orders')
        .update({
          activity_log: [
            ...log,
            {
              date: new Date().toISOString(),
              type: 'mockup',
              message: `${emoji} Customer ${status} the design mockup.${client_feedback ? ` Notes: "${client_feedback}"` : ''}`,
              user: 'Customer',
            },
          ],
        })
        .eq('id', mockup.order_id);
    }

    return NextResponse.json({ success: true, mockup: updated });
  } catch (err) {
    if (err.message === 'Unauthorized')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    console.error('User Mockups PATCH Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
