import { supabaseFetcher } from '../../config/adapters/supabase.adapter';
import { Book } from '../../core/entities/book.entity';
import { DatabaseBook, UserBook } from '../interfaces/supabase.responses';
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

/**
 * Checks if a book exists in the user's collection.
 *
 * @param isbn The ISBN of the book to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the book exists, false otherwise.
 * @throws {Error} If there is an error checking the book's existence in the database.
 */
export const databaseCheckUserBookExists = async (isbn: string): Promise<boolean> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        const data: UserBook[] = await supabaseFetcher.get(`/user_books?user_id=eq.${userId}&isbn=eq.${isbn}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return data.length > 0;

    } catch (error) {
        throw new Error(`Error checking user book existence in database: ${error}`);
    }
};

/**
 * Searches for a book by its ISBN in the database.
 *
 * @param isbn The ISBN of the book to search for.
 * @returns {Promise<DatabaseBook>} A promise that resolves to the book data if found, or an empty object if not found.
 * @throws {Error} If there is an error searching for the book in the database.
 */
export const databaseSearchBookByIsbn = async (isbn: string): Promise<DatabaseBook> => {

    const accessToken = getAccessToken();

    try {
        const data: DatabaseBook[] = await supabaseFetcher.get(`/books?isbn=eq.${isbn}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data[0];

    } catch (error) {
        throw new Error(`Error searching book by ISBN on database: ${error}`);
    }
};

/**
 * Adds a new book to the books general info table in the database.
 *
 * @param book The book to add.
 * @returns {Promise<void>} Nothing.
 * @throws {Error} If there is an error adding the book to the database.
 */
export const databaseAddBook = async (book: Book): Promise<void> => {

    const accessToken = getAccessToken();

    try {
        await supabaseFetcher.post(
            '/books',
            {
                'title': book.title,
                'isbn': book.isbn,
                'author': book.author,
                'pages': Number(book.pages),
                'cover_url': book.cover_url,
                'release_year': Number(book.release_year),
            },
            {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                Prefer: 'return=minimal',
            },
        });
        console.log('sale del post del addbook');
        return;
    } catch (error) {
        throw new Error(`Error adding book to database: ${error}`);
    }
};


export const databaseAddUserBook = async (book: Book): Promise<void> => {

    const accessToken = getAccessToken();
    const userId = getUserId();

    try {
        await supabaseFetcher.post(
            '/user_books',
            {
                'user_id': userId,
                'isbn': book.isbn,
                'author': book.author,
                'pages': Number(book.pages),
                'cover_url': book.cover_url,
                'release_year': Number(book.release_year),
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    Prefer: 'return=minimal',
                },
            }
        );
        console.log('Sale del add user book');
        return;
    } catch (error) {
        throw new Error(`Error adding user book to database: ${error}`);
    }
};
