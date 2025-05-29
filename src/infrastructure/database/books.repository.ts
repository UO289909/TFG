import { SupabaseClient } from './supabaseClient';

export const getBooksByUser = async (userId: string) => {

    const { data, error } = await SupabaseClient
        .from('user_books')
        .select('*')
        .eq('user_id', userId);
    if (error) {
        throw error;
    }

    return data;
};
