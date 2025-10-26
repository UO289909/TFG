import { HttpAdapter } from '../../../config/adapters/http.adapter';
import { databaseCheckUserBookExists, databaseSearchBookByIsbn } from '../../../infrastructure/database/books.repository';
import { BookData, OpenLibraryResponseByIsbn } from '../../../infrastructure/interfaces/open-library.responses';
import { DatabaseBook } from '../../../infrastructure/interfaces/supabase.responses';
import { BookMapper } from '../../../infrastructure/mappers/book.mapper';
import { Book } from '../../entities/book.entity';

/**
 * Gets a book by its ISBN. First checks the local database, if not found, fetches from OpenLibrary.
 * @param fetcher Fetcher instance to make HTTP requests.
 * @param isbn ISBN of the book to fetch.
 * @returns Book entity, a flag indicating if it was fetched from OpenLibrary, and a flag indicating if it already exists in the user's collection.
 */
export const getBookByIsbn = async (
    fetcher: HttpAdapter,
    isbn: string,
): Promise<{book: Book | null, fromOpenLibrary: boolean | null, alreadyInUser: boolean}> => {

    try {
        const alreadyInUser = await databaseCheckUserBookExists(isbn);
        if (alreadyInUser) {
            return {book: null, fromOpenLibrary: null, alreadyInUser};
        }

        const bookInfo: DatabaseBook = await databaseSearchBookByIsbn(isbn);

        if (!bookInfo || (Array.isArray(bookInfo) && bookInfo.length === 0) || bookInfo.isbn === null) {
            const details: OpenLibraryResponseByIsbn = await fetcher.get('', {
            params: {
                format: 'json',
                jscmd: 'data',
                bibkeys: `ISBN:${isbn}`,
            },
            });

            const bookData: BookData = Object.values(details)[0];
            if (!bookData) {
                return {book: null, fromOpenLibrary: true, alreadyInUser: false};
            }
            const book: Book = BookMapper.fromOpenLibraryResponseToEntity(bookData);
            return {book, fromOpenLibrary: true, alreadyInUser: false};
        } else {
            const book: Book = BookMapper.fromDatabaseBookToEntity(bookInfo);
            return {book, fromOpenLibrary: false, alreadyInUser: false};
        }

    } catch (error) {
        throw new Error(`Error fetching book by ISBN: ${error}`);
    }
};
