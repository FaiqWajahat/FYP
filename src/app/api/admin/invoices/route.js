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

function getOrderStatus(isDepositPaid, isFinalPaid, stageIndex, shippingStatus) {
  if (!isDepositPaid) {
    return 'Payment Pending';
  }
  if (shippingStatus === 'Delivered') {
    return 'Completed';
  }
  if (shippingStatus === 'Dispatched' || shippingStatus === 'In Transit') {
    return 'Shipped';
  }
  const stage = stageIndex ?? 0;
  if (stage === 0) {
    return 'Processing';
  } else if (stage >= 1 && stage <= 8) {
    return 'Production';
  }
  return 'Processing';
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      userId, 
      orderId, 
      amount, 
      currency, 
      dueDate, 
      status, 
      notes, 
      pdfUrl 
    } = body
    
    console.log("POST Invoice Body:", body);

    if (!userId || !orderId || amount === undefined || isNaN(parseFloat(amount))) {
      return NextResponse.json({ 
        error: `Missing or invalid data: userId(${Boolean(userId)}), orderId(${Boolean(orderId)}), amount(${amount})` 
      }, { status: 400 });
    }

    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        order_id: orderId,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        status: status || 'unpaid',
        milestone_type: body.milestoneType || 'full',
        notes: notes || '',
        pdf_url: pdfUrl || '',
        due_date: dueDate || null,
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error("Supabase Invoice Insertion Error:", error);
      throw error;
    }
    return NextResponse.json({ success: true, invoice: data[0], message: "Invoice generated successfully" });
  } catch (err) {
    console.error("Fatal Admin Invoice Creation Error:", err)
    return NextResponse.json({ error: err.message || 'Failed to create invoice' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const supabase = getSupabase()

    console.log(`GET Invoice Request - ID: ${id || 'All'}`);

    if (id) {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles:user_id (full_name, email),
          orders:order_id (display_id, product_name)
        `)
        .eq('id', id)
        .single()
      
      if (error) {
        console.error("Fetch Single Invoice Error:", error);
        throw error
      }
      return NextResponse.json({ success: true, invoice: data })
    }

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        profiles:user_id (full_name),
        orders:order_id (display_id, product_name)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Fetch All Invoices Error:", error);
      throw error
    }
    
    console.log(`Fetched ${data?.length || 0} invoices successfully`);
    return NextResponse.json({ success: true, invoices: data });
  } catch (err) {
    console.error("Fatal GET Invoice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) throw new Error("Invoice ID is required")

    const supabase = getSupabase()

    // Fetch current invoice state to diff
    const { data: currentInvoice } = await supabase
      .from('invoices')
      .select('status, milestone_type, amount, order_id')
      .eq('id', id)
      .single();

    // Update the invoice
    const { data, error } = await supabase
      .from('invoices')
      .update({
        amount: updates.amount ? parseFloat(updates.amount) : undefined,
        currency: updates.currency,
        status: updates.status,
        milestone_type: updates.milestoneType,
        notes: updates.notes,
        pdf_url: updates.pdfUrl,
        due_date: updates.dueDate,
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error("Update Invoice Error:", error);
      throw error
    }

    const updatedInvoice = data[0];
    const orderId = updatedInvoice?.order_id || currentInvoice?.order_id;
    const milestone = updatedInvoice?.milestone_type || currentInvoice?.milestone_type;
    const prevStatus = currentInvoice?.status;
    const newStatus = updatedInvoice?.status;
    const now = new Date().toISOString();

    // ── Sync order when invoice status changes ────────────────────────────────
    if (orderId && newStatus !== prevStatus) {

      // Fetch current order log + status
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('activity_log, is_deposit_paid, is_final_paid, status, shipping_status, stage_index')
        .eq('id', orderId)
        .single();

      // Fetch ALL invoices for this order to compute flags based on actual DB state
      const { data: siblingInvoices } = await supabase
        .from('invoices')
        .select('milestone_type, status')
        .eq('order_id', orderId);

      const existingLog = Array.isArray(currentOrder?.activity_log) ? currentOrder.activity_log : [];
      const orderPatches = {};
      const newEvents = [];

      let nextDepositPaid = false;
      let nextFinalPaid = false;

      const hasFullInvoice = siblingInvoices.some(inv => inv.milestone_type === 'full');
      if (hasFullInvoice) {
        const fullPaid = siblingInvoices.some(inv => inv.milestone_type === 'full' && inv.status === 'paid');
        nextDepositPaid = fullPaid;
        nextFinalPaid = fullPaid;
      } else {
        nextDepositPaid = siblingInvoices.some(inv => (inv.milestone_type === 'deposit' || inv.milestone_type === 'deposit_30') && inv.status === 'paid');
        nextFinalPaid = siblingInvoices.some(inv => (inv.milestone_type === 'final' || inv.milestone_type === 'final_30') && inv.status === 'paid');
      }

      // Check differences and prepare patches
      if (nextDepositPaid !== currentOrder?.is_deposit_paid) {
        orderPatches.is_deposit_paid = nextDepositPaid;
        if (nextDepositPaid) {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `💳 Deposit confirmed. Production pipeline unlocked.`,
            user: 'Admin',
          });
          newEvents.push({
            date: now,
            type: 'production',
            message: `🔓 Production pipeline is now active.`,
            user: 'System',
          });
        } else {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `⚠️ Deposit payment reversed. Production pipeline locked.`,
            user: 'Admin',
          });
        }
      }

      if (nextFinalPaid !== currentOrder?.is_final_paid) {
        orderPatches.is_final_paid = nextFinalPaid;
        if (nextFinalPaid) {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `💳 Final balance confirmed. Project fully funded.`,
            user: 'Admin',
          });
          newEvents.push({
            date: now,
            type: 'status',
            message: `✅ Order status updated — all payments cleared.`,
            user: 'System',
          });
        } else {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `⚠️ Final payment reversed. Dispatch lock re-activated.`,
            user: 'Admin',
          });
        }
      }

      // Special logs for midpoint invoice updates (which doesn't toggle order is_deposit/is_final paid directly)
      if (milestone === 'midpoint_40') {
        if (newStatus === 'paid') {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `💳 Midpoint (40%) invoice marked paid. Production continues.`,
            user: 'Admin',
          });
        } else if (newStatus === 'unpaid') {
          newEvents.push({
            date: now,
            type: 'payment',
            message: `⚠️ Midpoint payment reversed.`,
            user: 'Admin',
          });
        }
      }

      // Calculate next dynamic status
      const nextStatus = getOrderStatus(
        nextDepositPaid,
        nextFinalPaid,
        currentOrder?.stage_index ?? 0,
        currentOrder?.shipping_status || 'Pending'
      );
      if (nextStatus !== currentOrder?.status) {
        orderPatches.status = nextStatus;
      }

      // Apply order patches + merged log
      if (Object.keys(orderPatches).length > 0 || newEvents.length > 0) {
        await supabase
          .from('orders')
          .update({
            ...orderPatches,
            activity_log: [...existingLog, ...newEvents],
          })
          .eq('id', orderId);
      }
    }

    console.log("Invoice updated and order synced:", updatedInvoice?.id);
    return NextResponse.json({ success: true, invoice: updatedInvoice })
  } catch (err) {
    console.error("Fatal PATCH Invoice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) throw new Error("Invoice ID is required")

    console.log(`DELETE Invoice Request - ID: ${id}`);

    const supabase = getSupabase()

    // 1. Fetch current invoice state to see if we need to revert order payment
    const { data: invoice } = await supabase
      .from('invoices')
      .select('status, milestone_type, order_id')
      .eq('id', id)
      .single();

    // 2. Delete the invoice
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Delete Invoice Error:", error);
      throw error
    }

    // 3. Revert order status if the invoice was deleted and we need to recalculate payment flags
    if (invoice && invoice.order_id) {
      const { data: currentOrder } = await supabase
        .from('orders')
        .select('activity_log, is_deposit_paid, is_final_paid, status, shipping_status, stage_index')
        .eq('id', invoice.order_id)
        .single();
        
      // Fetch sibling invoices remaining AFTER deletion
      const { data: siblingInvoices } = await supabase
        .from('invoices')
        .select('milestone_type, status')
        .eq('order_id', invoice.order_id);

      const existingLog = Array.isArray(currentOrder?.activity_log) ? currentOrder.activity_log : [];
      const orderPatches = {};
      const newEvents = [];
      const now = new Date().toISOString();

      let nextDepositPaid = false;
      let nextFinalPaid = false;

      const hasFullInvoice = siblingInvoices.some(inv => inv.milestone_type === 'full');
      if (hasFullInvoice) {
        const fullPaid = siblingInvoices.some(inv => inv.milestone_type === 'full' && inv.status === 'paid');
        nextDepositPaid = fullPaid;
        nextFinalPaid = fullPaid;
      } else {
        nextDepositPaid = siblingInvoices.some(inv => (inv.milestone_type === 'deposit' || inv.milestone_type === 'deposit_30') && inv.status === 'paid');
        nextFinalPaid = siblingInvoices.some(inv => (inv.milestone_type === 'final' || inv.milestone_type === 'final_30') && inv.status === 'paid');
      }

      if (nextDepositPaid !== currentOrder?.is_deposit_paid) {
        orderPatches.is_deposit_paid = nextDepositPaid;
        newEvents.push({
          date: now,
          type: 'payment',
          message: `⚠️ Deposit invoice was deleted/removed. Recalculated deposit paid to: ${nextDepositPaid ? 'CONFIRMED' : 'REVERSED'}.`,
          user: 'Admin',
        });
      }

      if (nextFinalPaid !== currentOrder?.is_final_paid) {
        orderPatches.is_final_paid = nextFinalPaid;
        newEvents.push({
          date: now,
          type: 'payment',
          message: `⚠️ Final invoice was deleted/removed. Recalculated final paid to: ${nextFinalPaid ? 'CONFIRMED' : 'REVERSED'}.`,
          user: 'Admin',
        });
      }

      // Calculate next dynamic status
      const nextStatus = getOrderStatus(
        nextDepositPaid,
        nextFinalPaid,
        currentOrder?.stage_index ?? 0,
        currentOrder?.shipping_status || 'Pending'
      );
      if (nextStatus !== currentOrder?.status) {
        orderPatches.status = nextStatus;
      }

      if (Object.keys(orderPatches).length > 0 || newEvents.length > 0) {
        await supabase
          .from('orders')
          .update({
            ...orderPatches,
            activity_log: [...existingLog, ...newEvents],
          })
          .eq('id', invoice.order_id);
      }
    }

    console.log("Invoice deleted successfully:", id);
    return NextResponse.json({ success: true, message: "Invoice deleted successfully" })
  } catch (err) {
    console.error("Fatal DELETE Invoice Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
