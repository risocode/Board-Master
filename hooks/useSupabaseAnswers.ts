import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Add a type for the answer parameter:
type UserAnswer = {
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  // Add other fields as needed
};

export function useSupabaseAnswers(userId: string | null) {
  const [userIdState, setUserIdState] = useState<string | null>(userId);

  useEffect(() => {
    async function getUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      setUserIdState(user?.id || null);
    }
    getUserId();
  }, []);

  // Fetch all answers for the logged-in user
  const fetchAnswers = useCallback(async () => {
    if (!userIdState) return [];
    const { data, error } = await supabase
      .from('user_answers')
      .select('*')
      .eq('user_id', userIdState);
    if (error) throw error;
    return data || [];
  }, [userIdState]);

  // Save a new answer for the logged-in user
  const saveAnswer = useCallback(async (answer: UserAnswer) => {
    if (!userIdState) throw new Error('Not logged in');
    const { error } = await supabase
      .from('user_answers')
      .insert([
        { ...answer, user_id: userIdState },
      ]);
    if (error) throw error;
  }, [userIdState]);

  return { fetchAnswers, saveAnswer };
} 