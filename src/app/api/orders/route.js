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

    // 1. Insert into orders table
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: userId || null,
        product_name: product.name,
        sku: product.sku,
        total_amount: pricing?.totalWithFees || pricing?.subtotal || 0,
        currency: 'USD',
        status: 'payment pending',
        customization: customization || {},
        customization_data: customization || {}, 
        design_assets: body.design_assets || [], // New persistent URLs
        sizing: sizing || {},
        sizing_data: sizing || {}, 
        pricing: pricing || {},
        production_stage: 'Design & Tech Pack',
        stage_index: 1, 
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
