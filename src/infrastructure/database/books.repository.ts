import { SupabaseClient } from './supabaseClient';

export const databaseGetMyBooks = async () => {

    console.log('Entra en databaseGetMyBooks y ejecuta');
    console.log('Sesión actual:', SupabaseClient.auth.session());
    const { data, error } = await SupabaseClient
        .from('user_books')
        .select('*');
    console.log('sale de ejecutar la consulta');
    if (error) {
        throw new Error(`Error fetching my books from database: ${ error }`);
    }

    return data;

};
