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

    // 1. Fetch all core data in parallel
    const [ordersRes, invoicesRes, mockupsRes] = await Promise.all([
      adminSupabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      adminSupabase.from('invoices').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      adminSupabase.from('mockups').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    ]);

    const orders   = ordersRes.data || [];
    const invoices = invoicesRes.data || [];
    const mockups  = mockupsRes.data || [];

    // 2. Calculate Top Stats
    const totalSpent = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

    const ongoingProjects = orders.filter(o => {
      const s = (o.status || '').toLowerCase();
      return s !== 'delivered' && s !== 'completed' && s !== 'dispatched';
    }).length;

    const pendingMockupsCount = mockups.filter(m => m.status === 'pending').length;
    const unpaidInvoicesCount = invoices.filter(inv => inv.status === 'pending').length;

    // 3. Status Distribution (Pie Chart Data)
    const statusCounts = {};
    orders.forEach(o => {
      const stage = o.production_stage || 'Unknown';
      statusCounts[stage] = (statusCounts[stage] || 0) + 1;
    });
    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    // 4. Spend History (Bar Chart Data - Last 6 Months)
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      last6Months.push({
        month: d.getMonth(),
        year: d.getFullYear(),
        name: monthsShort[d.getMonth()],
        spend: 0
      });
    }

    invoices.filter(inv => inv.status === 'paid').forEach(inv => {
      const date = new Date(inv.created_at);
      const m = date.getMonth();
      const y = date.getFullYear();
      const monthSlot = last6Months.find(slot => slot.month === m && slot.year === y);
      if (monthSlot) {
        monthSlot.spend += (Number(inv.amount) || 0);
      }
    });

    // 5. Pending Actions
    const pendingActions = [];
    mockups.filter(m => m.status === 'pending').forEach(m => {
      const matchedOrder = orders.find(o => o.id === m.order_id);
      pendingActions.push({
        id: `mockup-${m.id}`,
        type: 'Mockup Approval',
        description: `Design mockup for ${matchedOrder?.product_name || 'your order'} is ready.`,
        urgency: 'high',
        link: '/dashboard/mockups',
        time: m.created_at
      });
    });

    invoices.filter(inv => inv.status === 'pending').forEach(inv => {
      const matchedOrder = orders.find(o => o.id === inv.order_id);
      pendingActions.push({
        id: `invoice-${inv.id}`,
        type: 'Payment Required',
        description: `${inv.milestone_type || 'Invoice'} for ${matchedOrder?.product_name || 'your project'} is pending.`,
        urgency: 'medium',
        link: '/dashboard/invoices',
        time: inv.created_at
      });
    });

    // 6. Recent Activity
    const recentActivity = orders.slice(0, 5).map(o => ({
      id: 1000 + (o.display_id || 0),
      rawId: o.id,
      product: o.product_name,
      date: o.created_at,
      status: o.status,
      stage: o.production_stage,
      total: o.total_amount,
      items: o.quantity || 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalOrders: orders.length,
          totalSpent,
          ongoingProjects,
          pendingActionsCount: pendingActions.length
        },
        charts: {
          spendHistory: last6Months,
          statusDistribution
        },
        pendingActions: pendingActions.sort((a, b) => new Date(b.time) - new Date(a.time)),
        recentOrders: recentActivity
      }
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
