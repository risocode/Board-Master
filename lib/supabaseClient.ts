import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
}

export function signOut() {
  return supabase.auth.signOut();
} 