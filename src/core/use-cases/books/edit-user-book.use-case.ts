import { databaseEditUserBook } from '../../../infrastructure/database/books.repository';

/**
 * Edits a book in the user's collection with the provided details.
 * @param isbn ISBN of the book to edit.
 * @param author Author of the book.
 * @param pages Number of pages in the book.
 * @param current_page Current page the user is on.
 * @param cover_url URL of the book's cover image.
 * @param release_year Release year of the book.
 * @param start_date Date when the user started reading the book.
 * @param finish_date Date when the user finished reading the book.
 * @param rating Rating given by the user to the book.
 * @param review Review written by the user for the book.
 */
export const editUserBook = async (
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
    try {

        await databaseEditUserBook(
            isbn,
            author,
            pages,
            current_page,
            cover_url,
            release_year,
            start_date,
            finish_date,
            rating,
            review
        );

        return;

    } catch (error) {
        throw new Error(`Error editing book: ${error}`);
    }
};
