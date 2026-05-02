import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const getAdminSupabase = () => {
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

// ─── POST: Submit a new inquiry ──────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    // Auth — get logged-in user (optional for guests)
    let userId = null;
    try {
      const cookieStore = await cookies();
      const supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll() { },
          },
        }
      );
      const { data: { session } } = await supabaseClient.auth.getSession();
      userId = session?.user?.id || null;
    } catch (_) { /* guest submission */ }

    const supabase = getAdminSupabase();

    // Calculate total quantity from sizes
    const sizes = body.sizes || {};
    const totalQuantity = Object.values(sizes).reduce((a, b) => a + (parseInt(b) || 0), 0);

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        user_id: userId,
        // Step 1
        category_id: body.categoryId || '',
        category_name: body.categoryName || '',
        uploaded_design_name: body.uploadedDesignName || null,
        uploaded_design_url: body.uploadedDesignUrl || null,
        // Step 2
        construction: body.construction || {},
        // Step 3
        fabric_id: body.fabricId || null,
        gsm: body.gsm || 0,
        custom_fabric_notes: body.customFabricNotes || null,
        // Step 4
        color_type: body.colorType || 'solid',
        zone_colors: body.zoneColors || {},
        custom_pantone: body.customPantone || null,
        artwork_placements: body.artworkPlacements || [],
        artwork_notes: body.artworkNotes || null,
        // Step 5
        sizes: body.sizes || {},
        total_quantity: totalQuantity,
        size_chart_file: body.sizeChartFile || null,
        size_chart_url: body.sizeChartUrl || null,
        custom_measurements: body.customMeasurements || false,
        measurements: body.measurements || {},
        grading_notes: body.gradingNotes || null,
        // Step 6
        label_type: body.labelType || null,
        label_placement: body.labelPlacement || null,
        label_artwork_file: body.labelArtworkFile || null,
        label_artwork_url: body.labelArtworkUrl || null,
        packaging: body.packaging || [],
        hang_tag_file: body.hangTagFile || null,
        hang_tag_url: body.hangTagUrl || null,
        // Step 7
        timeline: body.timeline || 'standard',
        destination: body.destination || null,
        incoterm: body.incoterm || 'fob',
        sample_required: body.sampleRequired || false,
        sample_qty: body.sampleQty || 1,
        company_name: body.companyName || null,
        contact_name: body.contactName || null,
        email: body.email || null,
        phone: body.phone || null,
        website: body.website || null,
        special_notes: body.specialNotes || null,
        // Admin defaults
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Inquiry Insert Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      inquiryId: data.id,
      displayId: `INQ-${1000 + (data.display_id || 0)}`,
    });

  } catch (err) {
    console.error('Inquiry API Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ─── GET: List inquiries for current user ────────────────────────────────────
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { },
        },
      }
    );

    const { data: { session }, error: authError } = await supabaseClient.auth.getSession();
    if (authError || !session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getAdminSupabase();

    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, inquiries: data });

  } catch (err) {
    console.error('Inquiry Fetch Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
