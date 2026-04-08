import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ category: data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data, error } = await supabase
      .from('categories')
      .update({
        name: body.name,
        slug: slug,
        description: body.description,
        subcategories: body.subcategories,
        status: body.status,
        image_url: body.imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, category: data[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const { error, count } = await supabase
      .from('categories')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (count === 0) return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
