import { Book } from '../../core/entities/book.entity';
import { DatabaseBook, DatabaseReadingLog, UserBook } from '../interfaces/supabase.responses';
import { getUserId } from './auth.repository';
import { SupabaseClient } from './supabaseClient';

/**
 * Fetches the books associated with the current user from the database.
 *
 * @param {number} [limit] The maximum number of books to fetch.
 * @param {number} [offset] The number of books to skip before starting to fetch.
 * @returns {Promise<UserBook[]>} A promise that resolves to the user's books data in descending order.
 * @throws {Error} If there is an error fetching the data from the database.
 */
export const databaseGetMyBooks = async (limit?: number, offset?: number): Promise<UserBook[]> => {

    const userId = await getUserId();

    let query = SupabaseClient
        .from('user_books')
        .select()
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (typeof limit === 'number' && typeof offset === 'number') {
        query = query.range(offset, offset + limit - 1);
    }

    try {

        const { data, error } = await query;

        if (error) {
            throw error;
        }

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

    const userId = await getUserId();

    try {

        const { data, error } = await SupabaseClient
            .from('user_books')
            .select()
            .eq('user_id', userId)
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

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

    try {

        const { data, error } = await SupabaseClient
            .from('books')
            .select()
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

        return data[0];

    } catch (error) {
        throw new Error(`Error searching book by ISBN on database: ${error}`);
    }
};

/**
 * Searches for a user book by its ISBN in the database.
 *
 * @param isbn The ISBN of the book to search for.
 * @returns {Promise<UserBook>} A promise that resolves to the user book data if found, or an empty object if not found.
 * @throws {Error} If there is an error searching for the book in the database.
 */
export const databaseSearchUserBookByIsbn = async (isbn: string): Promise<UserBook> => {

    const userId = await getUserId();

    try {

        const { data, error } = await SupabaseClient
            .from('user_books')
            .select()
            .eq('user_id', userId)
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

        return data[0];

    } catch (error) {
        throw new Error(`Error searching user book by ISBN in database: ${error}`);
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

    try {

        const { error } = await SupabaseClient
            .from('books')
            .insert({
                'title': book.title,
                'isbn': book.isbn,
                'author': book.author,
                'pages': Number(book.pages),
                'cover_url': book.cover_url,
                'release_year': Number(book.release_year),
            });

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error adding book to database: ${error}`);
    }
};

/**
 * Adds a book to the user's collection.
 *
 * @param book The book to add.
 * @returns {Promise<void>} Nothing.
 * @throws {Error} If there is an error adding the book to the database.
 */
export const databaseAddUserBook = async (book: Book): Promise<void> => {

    const userId = await getUserId();

    try {

        const { error } = await SupabaseClient
            .from('user_books')
            .insert({
                'user_id': userId,
                'isbn': book.isbn,
                'author': book.author,
                'pages': Number(book.pages),
                'cover_url': book.cover_url,
                'release_year': Number(book.release_year),
            });

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error adding user book to database: ${error}`);
    }
};

/**
 * Rates a book for a user.
 *
 * @param isbn The ISBN of the book to rate.
 * @param rating The rating to give to the book.
 * @param review Optional review text provided by the user.
 * @param startDate The start date of the reading period.
 * @param finishDate The finish date of the reading period.
 */
export const databaseRateUserBook = async (isbn: string, rating: number, review: string | null, startDate: Date, finishDate: Date): Promise<void> => {

    const userId = await getUserId();

    try {

        const { error } = await SupabaseClient
            .from('user_books')
            .update({
                rating,
                review: review || null,
                start_date: startDate.toISOString().slice(0, 10),
                finish_date: finishDate.toISOString().slice(0, 10),
            })
            .eq('user_id', userId)
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error rating user book: ${error}`);
    }

};

/**
 * Deletes a book from the user's collection.
 *
 * @param isbn The ISBN of the book to delete.
 */
export const databaseDeleteUserBook = async (isbn: string): Promise<void> => {

    const userId = await getUserId();

    try {

        const { error } = await SupabaseClient
            .from('user_books')
            .delete()
            .eq('user_id', userId)
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error deleting user book: ${error}`);
    }

};

/**
 * Edits a user's book information in the database.
 *
 * @param userBook The user's book information to edit.
 */
export const databaseEditUserBook = async (
    isbn: string,
    author: string | null,
    pages: number | null,
    current_page: number | null,
    cover_url: string | null,
    release_year: number | null,
    start_date: string | null,
    finish_date: string | null,
    rating: number | null,
    review: string | null
): Promise<void> => {

    const userId = await getUserId();

    const updatedFields: Record<string, any> = {};
    if (author !== null) { updatedFields.author = author; }
    if (pages !== null) { updatedFields.pages = pages; }
    if (current_page !== null) { updatedFields.current_page = current_page; }
    if (cover_url !== null) { updatedFields.cover_url = cover_url; }
    if (release_year !== null) { updatedFields.release_year = release_year; }
    if (start_date !== null) { updatedFields.start_date = start_date; }
    if (finish_date !== null) { updatedFields.finish_date = finish_date; }
    if (rating !== null) { updatedFields.rating = rating; }
    if (review !== null) { updatedFields.review = review; }

    try {

        const { error } = await SupabaseClient
            .from('user_books')
            .update(updatedFields)
            .eq('user_id', userId)
            .eq('isbn', isbn);

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error editing user book: ${error}`);
    }

};

/**
 * Adds a reading log for a user and a book.
 *
 * @param isbn The ISBN of the book being read.
 * @param date The date of the reading session.
 * @param from_page The page number where the reading session started.
 * @param to_page The page number where the reading session ended.
 * @throws {Error} If there is an error adding the reading log to the database.
 */
export const databaseAddReadingLog = async (
    isbn: string,
    reading_date: string,
    from_page: number,
    to_page: number,
): Promise<void> => {

    const userId = await getUserId();

    try {

        const { error } = await SupabaseClient
            .from('reading_logs')
            .insert({
                user_id: userId,
                isbn,
                from_page,
                to_page,
                reading_date,
            });

        if (error) {
            throw error;
        }

        return;

    } catch (error) {
        throw new Error(`Error adding reading log: ${error}`);
    }
};

/**
 * Edits a reading log for a user and a book from a certain date.
 *
 * @param isbn The ISBN of the book being read.
 * @param reading_date The date of the reading session.
 * @param from_page The page number where the reading session started.
 * @param to_page The page number where the reading session ended.
 * @throws {Error} If there is an error adding the reading log to the database.
 */
export const databaseEditReadingLog = async (
    isbn: string,
    reading_date: string,
    from_page: number | null,
    to_page: number | null,
): Promise<void> => {

    const userId = await getUserId();

    const updatedFields: Record<string, any> = {};
    if (from_page !== null) { updatedFields.from_page = from_page; }
    if (to_page !== null) { updatedFields.to_page = to_page; }

    try {

        const { error } = await SupabaseClient
            .from('reading_logs')
            .update(updatedFields)
            .eq('user_id', userId)
            .eq('isbn', isbn)
            .eq('reading_date', reading_date);

        if (error) {
            throw error;
        }

        return;
    } catch (error) {
        throw new Error(`Error editing reading log: ${error}`);
    }
};

/**
 * Fetches reading logs from the database, optionally filtered by user and/or book ISBN.
 * @param user ID of the user whose logs to fetch. If not provided, fetches logs for the current user.
 * @param isbn ISBN of the book to filter logs by. If not provided, fetches logs for all books.
 * @returns A list of reading logs matching the specified criteria.
 */
export const databaseGetReadingLogs = async (
    user?: string,
    isbn?: string,
): Promise<DatabaseReadingLog[]> => {

    const userId = user || await getUserId();

    try {

        const query = SupabaseClient
            .from('reading_logs')
            .select()
            .eq('user_id', userId);

        if (isbn) {
            query.eq('isbn', isbn);
        }

        const { data, error } = await query.order('reading_date', { ascending: false });

        if (error) {
            throw error;
        }

        return data;

    } catch (error) {
        throw new Error(`Error fetching reading logs from database: ${error}`);
    }
};

/**
 * Checks if a reading log for selected date already exists for a given book ISBN.
 * @param isbn ISBN of the book to check.
 * @returns True if a reading log exists for selected day, false otherwise.
 */
export const databaseAlreadyLogged = async (isbn: string, reading_date: string): Promise<boolean> => {

    const userId = await getUserId();

    try {

        const { data, error } = await SupabaseClient
            .from('reading_logs')
            .select()
            .eq('user_id', userId)
            .eq('isbn', isbn)
            .eq('reading_date', reading_date);

        if (error) {
            throw error;
        }

        return data.length > 0;

    } catch (error) {
        throw new Error(`Error checking existing reading log in database for selected date: ${error}`);
    }
};

/**
 * Fetches the books read by a list of users from the database.
 * @param users Array of user IDs
 * @param offset The starting point for fetching records (for pagination)
 * @param limit The maximum number of records to fetch
 * @returns A list of books read by the specified users
 */
export const databaseGetUsersReadBooks = async (
    users: string[],
    offset?: number,
    limit?: number
): Promise<UserBook[] | null> => {

    try {

        let query = SupabaseClient
            .from('user_books')
            .select()
            .in('user_id', users)
            .not('finish_date', 'is', null)
            .order('finish_date', { ascending: false });

        if (typeof limit === 'number' && typeof offset === 'number') {
            query = query.range(offset, offset + limit - 1);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        if (data.length === 0) {
            return null;
        }

        return data;

    } catch (error) {
        throw new Error(`Error fetching users' read books from database: ${error}`);
    }
};
