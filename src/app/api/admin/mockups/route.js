import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getSupabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { cookies: { getAll() { return []; }, setAll() {} } }
  );

// ─── GET — list all mockups (admin view) ─────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const supabase = getSupabase();

    if (id) {
      const { data, error } = await supabase
        .from('mockups')
        .select(`*, orders:order_id (id, display_id, product_name), profiles:user_id (full_name, email)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, mockup: data });
    }

    const { data, error } = await supabase
      .from('mockups')
      .select(`*, orders:order_id (id, display_id, product_name), profiles:user_id (full_name, email)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, mockups: data || [] });
  } catch (err) {
    console.error('Admin Mockups GET Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── POST — upload image to Cloudinary, insert mockup row ────────
export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let imageUrl = '';
    let body = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) throw new Error('No image file provided');

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

      const uploaded = await cloudinary.uploader.upload(base64, {
        folder: 'mockups',
        resource_type: 'auto',
      });
      imageUrl = uploaded.secure_url;

      body = {
        order_id:   formData.get('order_id') || null,
        user_id:    formData.get('user_id')  || null,
        inquiry_id: formData.get('inquiry_id') || null,
        title:      formData.get('title') || 'Design Mockup',
        type:       formData.get('type')  || 'Digital Tech Pack',
        version:    formData.get('version') || 'v1.0',
        notes:      formData.get('notes') || null,
        uploaded_by: formData.get('uploaded_by') || 'admin',
        status:     formData.get('status') || 'pending',
      };
    } else {
      body = await request.json();
      if (!body.url) throw new Error('Image URL is required (JSON mode)');
      imageUrl = body.url;
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('mockups')
      .insert({
        order_id:    body.order_id   || null,
        user_id:     body.user_id    || null,
        inquiry_id:  body.inquiry_id || null,
        title:       body.title      || 'Design Mockup',
        type:        body.type       || 'Digital Tech Pack',
        url:         imageUrl,
        version:     body.version    || 'v1.0',
        notes:       body.notes      || null,
        uploaded_by: body.uploaded_by || 'admin',
        status:      body.status     || 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // ── Append activity log entry on the linked order ────────────
    if (body.order_id) {
      const { data: ord } = await supabase
        .from('orders')
        .select('activity_log')
        .eq('id', body.order_id)
        .single();

      const log = Array.isArray(ord?.activity_log) ? ord.activity_log : [];
      await supabase
        .from('orders')
        .update({
          activity_log: [
            ...log,
            {
              date: new Date().toISOString(),
              type: 'mockup',
              message: `🖼️ New mockup uploaded: "${body.title || 'Design Mockup'}" (${body.version || 'v1.0'})`,
              user: 'Admin',
            },
          ],
        })
        .eq('id', body.order_id);
    }

    return NextResponse.json({ success: true, mockup: data });
  } catch (err) {
    console.error('Admin Mockups POST Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── PATCH — update status / notes ───────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, notes, title, version, type } = body;
    if (!id) throw new Error('Mockup ID is required');

    const supabase = getSupabase();
    const updates = {};
    if (status  !== undefined) updates.status  = status;
    if (notes   !== undefined) updates.notes   = notes;
    if (title   !== undefined) updates.title   = title;
    if (version !== undefined) updates.version = version;
    if (type    !== undefined) updates.type    = type;

    const { data, error } = await supabase
      .from('mockups')
      .update(updates)
      .eq('id', id)
      .select(`*, orders:order_id (id, display_id, product_name), profiles:user_id (full_name, email)`)
      .single();

    if (error) throw error;

    // ── Log status change on order ────────────────────────────────
    if (status && data.order_id) {
      const { data: ord } = await supabase
        .from('orders')
        .select('activity_log')
        .eq('id', data.order_id)
        .single();

      const log = Array.isArray(ord?.activity_log) ? ord.activity_log : [];
      const emoji = status === 'approved' ? '✅' : status === 'rejected' ? '❌' : '🔄';
      await supabase
        .from('orders')
        .update({
          activity_log: [
            ...log,
            {
              date: new Date().toISOString(),
              type: 'mockup',
              message: `${emoji} Mockup status changed to: ${status}`,
              user: 'Admin',
            },
          ],
        })
        .eq('id', data.order_id);
    }

    return NextResponse.json({ success: true, mockup: data });
  } catch (err) {
    console.error('Admin Mockups PATCH Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── DELETE — remove a mockup (and Cloudinary asset) ─────────────
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Mockup ID is required');

    const supabase = getSupabase();

    // Fetch URL before deletion so we can remove from Cloudinary
    const { data: mockup } = await supabase
      .from('mockups')
      .select('url')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('mockups').delete().eq('id', id);
    if (error) throw error;

    // Optionally destroy Cloudinary asset
    if (mockup?.url) {
      try {
        const parts = mockup.url.split('/');
        const fileWithExt = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (_) {
        // Non-fatal — image deletion failure shouldn't break response
      }
    }

    return NextResponse.json({ success: true, message: 'Mockup deleted' });
  } catch (err) {
    console.error('Admin Mockups DELETE Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
