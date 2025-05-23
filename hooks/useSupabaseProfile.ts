import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseProfileSync(userEmailOrId: string) {
  useEffect(() => {
    async function syncProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
          },
        ]);
      }
    }
    syncProfile();
  }, []);
} 