import { SupabaseClient } from './supabaseClient';

export const databaseGetMyBooks = async () => {

    const { data, error } = await SupabaseClient
        .from('user_books')
        .select('*');

    if (error) {
        throw new Error(`Error fetching my books from database: ${ error }`);
    }

    return data;

};
