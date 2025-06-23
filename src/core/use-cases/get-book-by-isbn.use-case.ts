import { HttpAdapter } from '../../config/adapters/http.adapter';
import { databaseCheckUserBookExists, databaseSearchBookByIsbn } from '../../infrastructure/database/books.repository';
import { BookData, OpenLibraryResponseByIsbn } from '../../infrastructure/interfaces/open-library.responses';
import { DatabaseBook } from '../../infrastructure/interfaces/supabase.responses';
import { BookMapper } from '../../infrastructure/mappers/book.mapper';
import { Book } from '../entities/book.entity';


export const getBookByIsbn = async (
    fetcher: HttpAdapter,
    isbn: string,
): Promise<Book> => {

    try {
        const userAlreadyHasBook = await databaseCheckUserBookExists(isbn);
        if (userAlreadyHasBook) {
            throw new Error('User already has this book in their collection');
        }

        const bookInfo: DatabaseBook = await databaseSearchBookByIsbn(isbn);
        console.log('Database response:', bookInfo);
        if (bookInfo === null) {
            const details: OpenLibraryResponseByIsbn = await fetcher.get('', {
                params: {
                    format: 'json',
                    jscmd: 'data',
                    bibkeys: `ISBN:${isbn}`,
                },
            });

            const bookData: BookData = Object.values(details)[0];
            console.log('Book data:', bookData);
            BookMapper.fromOpenLibraryResponseToEntity(bookData);
        }

    } catch (error) {
        throw new Error(`Error fetching book by ISBN: ${ error }`);
    }
};
