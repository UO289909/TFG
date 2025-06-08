import { supabaseFetcher } from '../../config/adapters/supabase.adapter';
import { UserBook } from '../interfaces/supabase.responses';
import { getAccessToken, getUserId } from './auth.repository';

/**
 * Fetches the books associated with the current user from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the user's books data.
 * @throws {Error} If there is an error fetching the data from the database.
 */
export const databaseGetMyBooks = async (): Promise<UserBook[]> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        const data: UserBook[] = await supabaseFetcher.get(`/user_books?user_id=eq.${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;

    } catch (error) {
        throw new Error(`Error fetching user books from database: ${error}`);
    }

};
