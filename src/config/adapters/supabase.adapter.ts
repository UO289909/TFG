import { AxiosAdapter } from './axios.adapter';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';

export const supabaseFetcher = new AxiosAdapter({
    baseUrl: `${SUPABASE_URL}`,
    apikey: SUPABASE_ANON_KEY,
});
