import { Book } from '../../core/entities/book.entity';
import { DatabaseBook, UserBook } from '../interfaces/supabase.responses';
import { getUserId } from './auth.repository';
import { SupabaseClient } from './supabaseClient';

/**
 * Fetches the books associated with the current user from the database.
 *
 * @returns {Promise<UserBook[]>} A promise that resolves to the user's books data.
 * @throws {Error} If there is an error fetching the data from the database.
 */
export const databaseGetMyBooks = async (): Promise<UserBook[]> => {

    const userId = await getUserId();

    try {

        const { data, error } = await SupabaseClient
            .from('user_books')
            .select()
            .eq('user_id', userId);

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
 * @param startDate The start date of the reading period.
 * @param finishDate The finish date of the reading period.
 */
export const databaseRateUserBook = async (isbn: string, rating: number, startDate: Date, finishDate: Date): Promise<void> => {

    const userId = await getUserId();

    try {

        const { error } = await SupabaseClient
            .from('user_books')
            .update({
                rating,
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
    cover_url: string | null,
    release_year: number | null,
    start_date: string | null,
    finish_date: string | null,
    rating: number | null
): Promise<void> => {

    const userId = await getUserId();

    const updatedFields: Record<string, any> = {};
    if (author !== null) { updatedFields.author = author; }
    if (pages !== null) { updatedFields.pages = pages; }
    if (cover_url !== null) { updatedFields.cover_url = cover_url; }
    if (release_year !== null) { updatedFields.release_year = release_year; }
    if (start_date !== null) { updatedFields.start_date = start_date; }
    if (finish_date !== null) { updatedFields.finish_date = finish_date; }
    if (rating !== null) { updatedFields.rating = rating; }

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
