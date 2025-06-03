import { HttpAdapter } from '../../config/adapters/http.adapter';
import { databaseGetMyBooks } from '../../infrastructure/database/books.repository';
import { BookData, OpenLibraryResponseByIsbn } from '../../infrastructure/interfaces/open-library.responses';
import { BookMapper } from '../../infrastructure/mappers/book.mapper';
import { Book } from '../entities/book.entity';


export const getMyBooks = async (
    fetcher: HttpAdapter,
): Promise<Book[]> => {

    try {
        const databaseResponse = await databaseGetMyBooks();
        console.log('Database response:', databaseResponse);

        const booksWithDetails = await Promise.all(
            databaseResponse.map(async (book) => {
                const details: OpenLibraryResponseByIsbn = await fetcher.get(`&bibkeys=ISBN%3A${book.isbn}`);
                return details;
            })
        );
        console.log('Books with details:', booksWithDetails);

        const myBooks: Book[] = booksWithDetails.map((details) => {
            const bookData: BookData = Object.values(details)[0];
            return BookMapper.fromOpenLibraryResponseToEntity(bookData);
        });
        console.log('Mapped books:', myBooks);

        return myBooks;

    } catch (error) {
        throw new Error(`Error fetching my books: ${ error }`);
    }
};
