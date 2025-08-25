import { databaseAddBook, databaseAddUserBook } from '../../../infrastructure/database/books.repository';
import { Book } from '../../entities/book.entity';


export const postNewBook = async (
    book: Book,
    userFields: string[],
    newBook: boolean,
): Promise<void> => {

    try {
        if (newBook) {
            const bookGeneralInfo: Book = {
                title: book.title,
                isbn: book.isbn,
                author: userFields.includes('author') ? null : book.author,
                cover_url: userFields.includes('cover_url') ? null : book.cover_url,
                release_year: userFields.includes('release_year') ? null : book.release_year,
                pages: userFields.includes('pages') ? null : book.pages,
                rating: null,
                start_date: null,
                finish_date: null,
            };
            await databaseAddBook(bookGeneralInfo);
            console.log('Libro añadido a books', bookGeneralInfo);
        }

        const bookUserInfo: Book = {
            title: book.title,
            isbn: book.isbn,
            author: userFields.includes('author') ? book.author : null,
            cover_url: userFields.includes('cover_url') ? book.cover_url : null,
            release_year: userFields.includes('release_year') ? book.release_year : null,
            pages: userFields.includes('pages') ? book.pages : null,
            rating: null,
            start_date: null,
            finish_date: null,
        };
        await databaseAddUserBook(bookUserInfo);
        console.log('Libro añadido a user_books', bookUserInfo);

        return;

    } catch (error) {
        throw new Error(`Error fetching my books: ${error}`);
    }
};
