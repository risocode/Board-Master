import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseProfileSync(user: { id: string, email: string, name?: string, avatar_url?: string }) {
  useEffect(() => {
    async function syncProfile() {
      if (user) {
        await supabase.from('profiles').upsert([
          {
            id: user.id,
            email: user.email,
            full_name: user.name || user.email,
            avatar_url: user.avatar_url || null,
          },
        ]);
      }
    }
    syncProfile();
  }, [user]);
} 