import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        localStorage: AsyncStorage,
    }
);
