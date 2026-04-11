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

// ─── Helper: append events to an order's activity_log ────────────────────────
async function appendOrderEvents(supabase, orderId, newEvents) {
  // Fetch the current log first
  const { data: current } = await supabase
    .from('orders')
    .select('activity_log')
    .eq('id', orderId)
    .single();

  const existing = Array.isArray(current?.activity_log) ? current.activity_log : [];
  const merged = [...existing, ...newEvents];

  await supabase
    .from('orders')
    .update({ activity_log: merged })
    .eq('id', orderId);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const supabase = getSupabase()

    if (id) {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (full_name, email, profile_image),
          invoices (id, amount, status, milestone_type)
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error("Supabase Order Detail Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: data })
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (full_name, email, profile_image)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, orders: data });
  } catch (err) {
    console.error("Admin Order Fetch Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) throw new Error("Order ID is required")

    const supabase = getSupabase()

    // Fetch current state to diff against
    const { data: current } = await supabase
      .from('orders')
      .select('production_stage, stage_index, status, is_deposit_paid, is_final_paid, activity_log')
      .eq('id', id)
      .single();

    const existingLog = Array.isArray(current?.activity_log) ? current.activity_log : [];
    const newEvents = [];
    const now = new Date().toISOString();

    // ── 1. Production Stage Change ────────────────────────────────────────────
    if (
      updates.production_stage !== undefined &&
      updates.production_stage !== current?.production_stage
    ) {
      const prevStage = current?.stage_index ?? 0;
      const nextStage = updates.stage_index ?? prevStage;
      const isRevert = nextStage < prevStage;

      newEvents.push({
        date: now,
        type: 'production',
        message: isRevert
          ? `⏪ Pipeline reverted to: ${updates.production_stage}`
          : `🏭 Production advanced to: ${updates.production_stage}`,
        user: 'Admin',
      });
    }

    // ── 2. Order Status Change ────────────────────────────────────────────────
    if (
      updates.status !== undefined &&
      updates.status !== current?.status
    ) {
      newEvents.push({
        date: now,
        type: 'status',
        message: `📋 Order status changed to: ${updates.status}`,
        user: 'Admin',
      });
    }

    // ── 3. Deposit Payment Flag ───────────────────────────────────────────────
    if (
      updates.is_deposit_paid !== undefined &&
      updates.is_deposit_paid !== current?.is_deposit_paid
    ) {
      newEvents.push({
        date: now,
        type: 'payment',
        message: updates.is_deposit_paid
          ? '✅ Deposit payment confirmed. Production pipeline unlocked.'
          : '⚠️ Deposit payment reversed.',
        user: 'Admin',
      });
    }

    // ── 4. Final Payment Flag ─────────────────────────────────────────────────
    if (
      updates.is_final_paid !== undefined &&
      updates.is_final_paid !== current?.is_final_paid
    ) {
      newEvents.push({
        date: now,
        type: 'payment',
        message: updates.is_final_paid
          ? '✅ Final balance payment confirmed. Dispatch unlocked.'
          : '⚠️ Final payment reversed.',
        user: 'Admin',
      });
    }

    const mergedLog = [...existingLog, ...newEvents];

    const { data, error } = await supabase
      .from('orders')
      .update({
        status: updates.status,
        production_stage: updates.production_stage,
        stage_index: updates.stage_index,
        mockup_url: updates.mockup_url,
        tech_pack_url: updates.tech_pack_url,
        is_deposit_paid: updates.is_deposit_paid,
        is_final_paid: updates.is_final_paid,
        shipping_tracking: updates.shipping_tracking,
        estimated_delivery: updates.estimated_delivery,
        total_amount: updates.total_amount,
        product_name: updates.product_name,
        activity_log: mergedLog,
      })
      .eq('id', id)
      .select()

    if (error) throw error
    return NextResponse.json({ success: true, order: data[0] })
  } catch (err) {
    console.error("Admin Order Update Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) throw new Error("Order ID is required")

    const supabase = getSupabase()

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true, message: "Order deleted successfully" })
  } catch (err) {
    console.error("Admin Order Deletion Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
