import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const getSupabase = () => {
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

// ─── GET: List all inquiries (admin) ─────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const supabase = getSupabase();

    if (id) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }

      // Fetch profile manually
      let profile = null;
      if (data.user_id) {
        const { data: profileData } = await supabase.from('profiles').select('full_name, email, profile_image').eq('id', data.user_id).single();
        profile = profileData;
      }
      
      return NextResponse.json({ success: true, inquiry: { ...data, profiles: profile } });
    }

    let query = supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: inquiries, error } = await query;
    if (error) throw error;

    // Fetch profiles manually to avoid schema relationship errors
    const userIds = [...new Set(inquiries.map(i => i.user_id).filter(Boolean))];
    let profilesMap = {};
    
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, profile_image')
        .in('id', userIds);
        
      if (profilesData) {
        profilesData.forEach(p => {
          profilesMap[p.id] = { full_name: p.full_name, email: p.email, profile_image: p.profile_image };
        });
      }
    }

    const inquiriesWithProfiles = inquiries.map(inq => ({
      ...inq,
      profiles: inq.user_id ? profilesMap[inq.user_id] : null
    }));

    return NextResponse.json({ success: true, inquiries: inquiriesWithProfiles });

  } catch (err) {
    console.error('Admin Inquiry Fetch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── PATCH: Update inquiry status/notes (admin) ──────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) throw new Error('Inquiry ID is required');

    const supabase = getSupabase();

    const updateData = {};
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.admin_notes !== undefined) updateData.admin_notes = updates.admin_notes;
    if (updates.quoted_amount !== undefined) updateData.quoted_amount = updates.quoted_amount;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('inquiries')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, inquiry: data });

  } catch (err) {
    console.error('Admin Inquiry Update Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── DELETE: Remove inquiry (admin) ──────────────────────────────────────────
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) throw new Error('Inquiry ID is required');

    const supabase = getSupabase();

    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Inquiry deleted' });

  } catch (err) {
    console.error('Admin Inquiry Delete Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
