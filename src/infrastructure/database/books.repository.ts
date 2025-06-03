import { SupabaseClient } from './supabaseClient';

export const getMyBooks = async () => {

    const { data, error } = await SupabaseClient
        .from('user_books')
        .select('*');

    if (error) {
        throw error;
    }

    return data;

};
