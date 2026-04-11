import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const getSupabase = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() { return [] },
        setAll() { },
      },
    }
  )
}

export async function GET(req) {
  const supabase = getSupabase();

  try {
    // 1. Metric Counts
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    
    // Check if products table exists or fallback gracefully
    const { count: productsCount, error: productsErr } = await supabase.from('products').select('*', { count: 'exact', head: true });
    
    // 2. Fetch Orders for aggregation and recent list
    const { data: orders } = await supabase
      .from('orders')
      .select('id, display_id, created_at, total_amount, status, product_name, sku, profiles(full_name), stage_index, is_deposit_paid, is_final_paid')
      .order('created_at', { ascending: false });

    // 3. Fetch Invoices for Revenue aggregation
    const { data: invoices } = await supabase
       .from('invoices')
       .select('amount, created_at, status')
       .eq('status', 'paid');

    const safeOrders = orders || [];
    const safeInvoices = invoices || [];

    // Aggregations
    const totalOrdersCount = safeOrders.length;
    const totalRevenue = safeInvoices.reduce((acc, inv) => acc + (Number(inv.amount) || 0), 0);

    const recentOrders = safeOrders.slice(0, 5);

    // Grouping by Month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const monthlySalesMap = {};
    safeOrders.forEach(o => {
       if(!o.created_at) return;
       const m = new Date(o.created_at).getMonth();
       monthlySalesMap[m] = (monthlySalesMap[m] || 0) + (Number(o.total_amount) || 0);
    });
    const monthlySales = months.map((name, i) => ({ name, sales: monthlySalesMap[i] || 0 }));

    const monthlyRevMap = {};
    safeInvoices.forEach(i => {
       if(!i.created_at) return;
       const m = new Date(i.created_at).getMonth();
       monthlyRevMap[m] = (monthlyRevMap[m] || 0) + (Number(i.amount) || 0);
    });
    const monthlyRevenue = months.map((name, i) => ({ name, revenue: monthlyRevMap[i] || 0 }));

    // Weekly Mock Calculation
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklySales = days.map(d => ({ name: d, sales: Math.floor(Math.random() * 500) + 200 }));
    const weeklyRevenue = days.map(d => ({ name: d, revenue: Math.floor(Math.random() * 400) + 100 }));

    return NextResponse.json({
      success: true,
      stats: {
        revenue: totalRevenue,
        ordersCount: totalOrdersCount,
        usersCount: usersCount || 0,
        productsCount: productsCount || 0,
      },
      recentOrders,
      charts: {
        monthlySales,
        weeklySales,
        monthlyRevenue,
        weeklyRevenue
      }
    });

  } catch (err) {
    console.error("Dashboard API Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
