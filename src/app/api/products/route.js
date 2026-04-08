import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();

    // Map frontend form directly to Supabase table
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          sku: body.sku,
          name: body.name,
          category: body.category,
          sub_category: body.subCategory,
          fabric: body.fabric,
          gsm_weight: body.gsmWeight,
          gsm: body.gsm,
          quantity: parseInt(body.quantity) || 0,
          description: body.description,
          status: body.status,
          sizing_mode: 'standard',
          is_featured: body.isFeatured,
          pricing_tiers: body.pricingTiers,
          branding_options: body.brandingOptions,
          sizes: body.sizes,
          colors: body.colors,
          images: body.images,
          tags: body.tags,
          size_chart: body.sizeChart || []
        }
      ])
      .select();

    if (error) {
      console.error("Supabase Insertion Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const product = data[0];
    const mappedProduct = {
      ...product,
      subCategory: product.sub_category,
      gsmWeight: product.gsm_weight,
      sizingMode: product.sizing_mode,
      isFeatured: product.is_featured,
      pricingTiers: product.pricing_tiers,
      brandingOptions: product.branding_options,
      sizeChart: product.size_chart,
    };

    return NextResponse.json({ success: true, product: mappedProduct });

  } catch (err) {
    console.error("API POST Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sku = searchParams.get('sku');
    const featured = searchParams.get('featured');

    const mapProduct = (p) => ({
      ...p,
      subCategory: p.sub_category,
      gsmWeight: p.gsm_weight,
      sizingMode: p.sizing_mode,
      isFeatured: p.is_featured,
      pricingTiers: p.pricing_tiers,
      brandingOptions: p.branding_options,
      sizeChart: p.size_chart,
    });

    if (sku) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .single();
        
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json({ product: mapProduct(data) });
    } else if (featured === 'true') {
      let { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(4);
        
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      // Fallback: If no featured products found, get 4 newest products
      if (!data || data.length === 0) {
        const { data: newestData, error: newestError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false })
          .limit(4);
          
        if (newestError) return NextResponse.json({ error: newestError.message }, { status: 400 });
        data = newestData;
      }

      return NextResponse.json({ products: (data || []).map(mapProduct) });
    } else {
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ products: (data || []).map(mapProduct) });
    }

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
