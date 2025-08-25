import { databaseSearchUserBookByIsbn } from '../../../infrastructure/database/books.repository';
import { UserBook } from '../../../infrastructure/interfaces/supabase.responses';


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
