import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/mail'

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

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      userId, 
      product, 
      customization, 
      sizing, 
      pricing, 
      paymentMethod, 
      paymentDivision 
    } = body

    const supabase = getSupabase()

    // 0. Ensure the profile row exists to prevent orders_user_id_fkey constraint failures
    if (userId) {
      const { data: profileExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (!profileExists) {
        console.log(`[Auto-Heal] Profile for user ${userId} is missing. On-the-fly creating...`);
        try {
          const { data: authUserData, error: authError } = await supabase.auth.admin.getUserById(userId)
          if (!authError && authUserData?.user) {
            const authUser = authUserData.user
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                email: authUser.email,
                full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
                role: 'user',
                created_at: authUser.created_at || new Date().toISOString()
              })
            if (insertError) {
              console.error("[Auto-Heal] Failed to insert profile row:", insertError.message)
            } else {
              console.log(`[Auto-Heal] Profile row for user ${userId} healed!`)
            }
          } else {
            console.error("[Auto-Heal] Failed to fetch auth user details:", authError?.message)
          }
        } catch (healErr) {
          console.error("[Auto-Heal] Exception during profile healing:", healErr)
        }
      }
    }

    // 1. Insert into orders table
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        product_name: product.name,
        sku: product.sku,
        total_amount: pricing?.totalWithFees || pricing?.subtotal || 0,
        currency: 'USD',
        status: 'Payment Pending',
        customization: customization || {},
        customization_data: customization || {}, 
        design_assets: body.design_assets || [], // New persistent URLs
        sizing: sizing || {},
        sizing_data: sizing || {}, 
        pricing: pricing || {},
        production_stage: 'Design & Tech Pack',
        stage_index: 0, 
        mockup_url: product.image,
        activity_log: [{ date: new Date().toISOString(), message: "Order initialized." }],
        payment_method: paymentMethod || 'Wire Transfer',
        payment_division: paymentDivision || 'full'
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase Order Insertion Error:", error);
      // Handle specific "Missing Column" error for any remaining mismatches
      if (error.message.includes("Could not find the") && error.message.includes("column")) {
        return NextResponse.json({ 
          success: false, 
          error: "Schema Sync Error: Please ensure you ran the final SQL script for 'payment_method'.",
          hint: error.message
        }, { status: 400 });
      }
      throw error
    }

    // 2. Fetch customer details and trigger email confirmation
    let customerEmail = null
    let customerName = 'Customer'

    if (userId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single()
      
      if (!profileError && profile) {
        customerEmail = profile.email
        customerName = profile.full_name || 'Customer'
      }
    }

    if (!customerEmail && body.customerMeta) {
      customerEmail = body.customerMeta.email
      customerName = body.customerMeta.name || 'Customer'
    }

    if (customerEmail) {
      const host = request.headers.get('host') || 'localhost:3000'
      const protocol = request.headers.get('x-forwarded-proto') || 'http'
      const siteUrl = `${protocol}://${host}`
      const orderUrl = `${siteUrl}/dashboard/orders/${data.id}`

      try {
        await sendOrderConfirmationEmail({
          recipientEmail: customerEmail,
          userName: customerName,
          displayId: `ORD-${1000 + (data.display_id || 0)}`,
          product: product || {},
          customization: customization || {},
          sizing: sizing || {},
          pricing: pricing || {},
          paymentMethod: paymentMethod || 'Wire Transfer',
          paymentDivision: paymentDivision || 'full',
          orderUrl
        })
      } catch (mailErr) {
        console.error("Failed to send order confirmation email:", mailErr)
      }
    }

    return NextResponse.json({ 
      success: true, 
      orderId: data.id, 
      displayId: `ORD-${1000 + (data.display_id || 0)}` 
    })

  } catch (err) {
    console.error("Order Creation API Error:", err)
    return NextResponse.json({ 
      success: false, 
      error: err.message || "An unexpected error occurred while processing your order." 
    }, { status: 500 })
  }
}
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) throw new Error("Order ID is required")

    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (full_name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error("Supabase Order Retrieval Error:", error);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: data })
  } catch (err) {
    console.error("Order Retrieval API Error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
