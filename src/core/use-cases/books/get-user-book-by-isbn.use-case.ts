import { databaseSearchUserBookByIsbn } from '../../../infrastructure/database/books.repository';
import { UserBook } from '../../../infrastructure/interfaces/supabase.responses';

/**
 * Gets a user book by its ISBN.
 * @param isbn ISBN of the book to fetch.
 * @returns UserBook entity.
 */
export const getUserBookByIsbn = async (
    isbn: string
): Promise<UserBook> => {

    try {
        const book = await databaseSearchUserBookByIsbn(isbn);
        return book;
    } catch (error) {
        throw new Error(`Error fetching user book by ISBN: ${error}`);
    }
};
