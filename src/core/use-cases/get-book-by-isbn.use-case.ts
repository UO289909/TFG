import { HttpAdapter } from '../../config/adapters/http.adapter';
import { databaseCheckUserBookExists, databaseSearchBookByIsbn } from '../../infrastructure/database/books.repository';
import { BookData, OpenLibraryResponseByIsbn } from '../../infrastructure/interfaces/open-library.responses';
import { DatabaseBook } from '../../infrastructure/interfaces/supabase.responses';
import { BookMapper } from '../../infrastructure/mappers/book.mapper';
import { Book } from '../entities/book.entity';


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
        console.log('Database response:', bookInfo);

        if (!bookInfo || (Array.isArray(bookInfo) && bookInfo.length === 0) || bookInfo.isbn === null) {
            console.log('No book found in database, fetching from OpenLibrary');
            const details: OpenLibraryResponseByIsbn = await fetcher.get('', {
            params: {
                format: 'json',
                jscmd: 'data',
                bibkeys: `ISBN:${isbn}`,
            },
            });

            const bookData: BookData = Object.values(details)[0];
            console.log('Book data:', bookData);
            const book: Book = BookMapper.fromOpenLibraryResponseToEntity(bookData);
            console.log('libro mapeado', book);
            return {book, fromOpenLibrary: true, alreadyInUser: false};
        } else {
            const book: Book = BookMapper.fromDatabaseBookToEntity(bookInfo);
            return {book, fromOpenLibrary: false, alreadyInUser: false};
        }

    } catch (error) {
        throw new Error(`Error fetching book by ISBN: ${error}`);
    }
};
