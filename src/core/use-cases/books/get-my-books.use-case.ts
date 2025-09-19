import { databaseGetMyBooks, databaseSearchBookByIsbn } from '../../../infrastructure/database/books.repository';
import { DatabaseBook, UserBook } from '../../../infrastructure/interfaces/supabase.responses';
import { Book } from '../../entities/book.entity';

/**
 * Gets the list of books in the user's collection, combining user-specific data with general book information from the database.
 * @returns A list of books in the user's collection, combining user-specific data with general book information from the database.
 */
export const getMyBooks = async (): Promise<Book[]> => {

    try {
        const userBooks: UserBook[] = await databaseGetMyBooks();
        console.log('User books response:', userBooks);

        const databaseBooks: DatabaseBook[] = await Promise.all(
            userBooks.map(async (userBook) => {
                const details: DatabaseBook = await databaseSearchBookByIsbn(userBook.isbn);
                return details;
            })
        );
        console.log('Database books response:', databaseBooks);

        const myBooks: Book[] = userBooks.map((userBook, idx) => {
            const dbBook = databaseBooks[idx];

            return {
                isbn: userBook.isbn,
                title: dbBook.title,
                pages: userBook.pages !== null && userBook.pages !== '0' && userBook.pages !== 0 ? userBook.pages.toString() : dbBook.pages,
                actual_page: userBook.actual_page.toString(),
                cover_url: userBook.cover_url !== null ? userBook.cover_url : dbBook.cover_url,
                release_year: userBook.release_year !== null && userBook.release_year !== 0 ? userBook.release_year.toString() : dbBook.release_year,
                author: userBook.author !== null ? userBook.author : dbBook.author,
                rating: userBook.rating,
                start_date: userBook.start_date,
                finish_date: userBook.finish_date,
                created_at: userBook.created_at,
            };
        });
        console.log('Mapped books:', myBooks);

        return myBooks;

    } catch (error) {
        throw new Error(`Error fetching my books: ${ error }`);
    }
};
