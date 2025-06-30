import { HttpAdapter } from '../../config/adapters/http.adapter';
import { databaseGetMyBooks } from '../../infrastructure/database/books.repository';
import { BookData, OpenLibraryResponseByIsbn } from '../../infrastructure/interfaces/open-library.responses';
import { UserBook } from '../../infrastructure/interfaces/supabase.responses';
import { BookMapper } from '../../infrastructure/mappers/book.mapper';
import { Book } from '../entities/book.entity';


export const getMyBooks = async (
    fetcher: HttpAdapter,
): Promise<Book[]> => {

    try {
        const databaseResponse: UserBook[] = await databaseGetMyBooks();
        console.log('Database response:', databaseResponse);

        const booksWithDetails = await Promise.all(
            databaseResponse.map(async (book) => {
                const details: OpenLibraryResponseByIsbn = await fetcher.get('', {
                    params: {
                        format: 'json',
                        jscmd: 'data',
                        bibkeys: `ISBN:${book.isbn}`,
                    },
                });
                return details;
            })
        );
        console.log('Books with details:', booksWithDetails);

        const myBooks: Book[] = booksWithDetails.map( (detail) => {
            console.log('Detail:', detail);
            const bookData: BookData = Object.values(detail)[0];
            console.log('Book data:', bookData);
            return BookMapper.fromOpenLibraryResponseToEntity(bookData);
        });
        console.log('Mapped books:', myBooks);

        return myBooks;

    } catch (error) {
        throw new Error(`Error fetching my books: ${ error }`);
    }
};
