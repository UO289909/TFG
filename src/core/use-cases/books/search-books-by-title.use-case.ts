import { HttpAdapter } from "../../../config/adapters/http.adapter";
import { databaseCheckUserBookExists, databaseGetBookByTitle } from "../../../infrastructure/database/books.repository";
import { OpenLibraryResponseByTitle } from "../../../infrastructure/interfaces/open-library.responses";
import { Book } from "../../entities/book.entity";
import { BookMapper } from '../../../infrastructure/mappers/book.mapper';

/**
 * Searches for books by title in the database and OpenLibrary.
 * @param fetcher Fetcher instance to make HTTP requests.
 * @param search The title of the book to search for.
 * @returns A promise that resolves to an array of books.
 */
export const searchBooksByTitle = async (
    fetcher: HttpAdapter,
    search: string,
): Promise<{ book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }[]> => {

    try {

        const databaseBook = await databaseGetBookByTitle(search);
        console.log(databaseBook);

        let alreadyInUser = false;
        if (databaseBook !== null) {
            alreadyInUser = await databaseCheckUserBookExists(databaseBook.isbn);
        }

        const openLibraryBooks: OpenLibraryResponseByTitle = await fetcher.get('', {
            params: {
                title: search,
                fields: 'title,author_name,isbn,cover_i',
                limit: '10',
                sort: 'rating'
            },
        });
        console.log(openLibraryBooks);

        if (openLibraryBooks.numFound === 0) {
            return [];
        }

        const results: { book: Book, fromOpenLibrary: boolean, alreadyInUser: boolean }[] = [];

        if (databaseBook !== null) {
            results.push({ book: BookMapper.fromDatabaseBookToEntity(databaseBook), fromOpenLibrary: false, alreadyInUser });
        }

        for (const book of openLibraryBooks.docs) {
            if (
                book.isbn === undefined ||
                book.isbn.length === null ||
                (
                    databaseBook !== null &&
                    book.isbn[0] === databaseBook.isbn
                )
            ) {
                continue;
            }
            const bookEntity = BookMapper.fromOpenLibrarySearchToEntity(book);
            const isDuplicate = results.some(r => r.book.isbn === bookEntity.isbn);
            if (isDuplicate) continue;
            results.push({ book: bookEntity, fromOpenLibrary: true, alreadyInUser: false });
        }

        console.log(results);
        return results;

    } catch (error) {
        throw new Error(`Error searching books by title: ${error}`);
    }

}