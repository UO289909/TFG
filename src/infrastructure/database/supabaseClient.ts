import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
