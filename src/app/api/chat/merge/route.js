import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function POST(request) {
  try {
    const body = await request.json();
    const { anonId } = body;

    if (!anonId) {
      return NextResponse.json({ success: false, error: 'anonId is required' }, { status: 400 });
    }

    // Authenticate the user making the request
    const cookieStore = await cookies();
    const supabaseUser = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() { },
        },
      }
    );

    const { data: { session }, error: authError } = await supabaseUser.auth.getSession();
    if (authError || !session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const supabase = getAdminSupabase();

    // 1. Find the anonymous conversation
    const { data: anonConv, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', anonId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    if (!anonConv) {
      return NextResponse.json({ success: true, message: 'No anonymous conversation found to merge' });
    }

    // 2. Check if the user already has an active conversation
    const { data: userConv, error: userConvError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (userConvError && userConvError.code !== 'PGRST116') throw userConvError;

    if (userConv) {
      // User already has a conversation. We should migrate the messages from anonConv to userConv
      await supabase
        .from('messages')
        .update({ 
          conversation_id: userConv.id,
          sender_id: userId 
        })
        .eq('conversation_id', anonConv.id)
        .eq('sender_id', anonId);

      // Delete the old anonymous conversation
      await supabase.from('conversations').delete().eq('id', anonConv.id);

      // Update userConv last_message if needed
      await supabase
        .from('conversations')
        .update({ 
          last_message: anonConv.last_message || userConv.last_message,
          updated_at: new Date().toISOString()
        })
        .eq('id', userConv.id);

    } else {
      // User doesn't have a conversation yet. Just update the anon conversation to belong to the new user
      await supabase
        .from('conversations')
        .update({ 
          user_id: userId
        })
        .eq('id', anonConv.id);
        
      // Update the messages to set new sender_id
      await supabase
        .from('messages')
        .update({ sender_id: userId })
        .eq('conversation_id', anonConv.id)
        .eq('sender_id', anonId);
    }

    return NextResponse.json({ success: true, message: 'Merged successfully' });

  } catch (err) {
    console.error('Guest Chat Merge Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
