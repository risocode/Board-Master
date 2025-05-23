import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  // Check if user exists
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', session.user.email)
    .single();
  if (!data) {
    await supabase.from('profiles').insert([
      {
        email: session.user.email,
        full_name: session.user.name,
        avatar_url: session.user.image,
      },
    ]);
  }
  return NextResponse.json({ ok: true });
} 