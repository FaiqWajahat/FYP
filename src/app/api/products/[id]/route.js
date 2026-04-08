import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const mappedProduct = {
      ...data,
      subCategory: data.sub_category,
      gsmWeight: data.gsm_weight,
      pricingTiers: data.pricing_tiers,
      brandingOptions: data.branding_options,
      sizeChart: data.size_chart,
      isFeatured: data.is_featured,
    };
    return NextResponse.json({ product: mappedProduct });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const { error, count } = await supabase
      .from('products')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (count === 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        sku: body.sku,
        category: body.category,
        sub_category: body.subCategory,
        fabric: body.fabric,
        gsm: body.gsm,
        gsm_weight: body.gsmWeight,
        moq: body.moq,
        pricing_tiers: body.pricingTiers,
        branding_options: body.brandingOptions,
        lead_time: body.leadTime,
        quantity: body.quantity,
        description: body.description,
        colors: body.colors,
        sizes: body.sizes,
        images: body.images,
        tags: body.tags,
        size_chart: body.sizeChart,
        status: body.status,
        is_featured: body.isFeatured,
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, product: data[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
