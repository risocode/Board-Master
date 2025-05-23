import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseAnswers() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    }
    getUserId();
  }, []);

  // Fetch all answers for the logged-in user
  const fetchAnswers = useCallback(async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('user_answers')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  }, [userId]);

  // Save a new answer for the logged-in user
  const saveAnswer = useCallback(async (answer) => {
    if (!userId) throw new Error('Not logged in');
    const { error } = await supabase
      .from('user_answers')
      .insert([
        { ...answer, user_id: userId },
      ]);
    if (error) throw error;
  }, [userId]);

  return { fetchAnswers, saveAnswer };
} 