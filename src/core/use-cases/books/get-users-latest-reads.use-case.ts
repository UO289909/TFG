import { databaseGetUsersReadBooks, databaseSearchBookByIsbn } from '../../../infrastructure/database/books.repository';
import { Book } from '../../entities/book.entity';
import { User } from '../../entities/user.entity';

/**
 * Get the latest read books for a list of users.
 * @param users Array of users to get the latest read books for.
 * @returns An array of objects containing the user's nickname and their latest read book.
 */
export const getUsersLatestReads = async (
    users: User[],
): Promise<{ nickname: string, book: Book }[]> => {

    const readBooks = await databaseGetUsersReadBooks(users.map(u => u.id));

    if (!readBooks) {
        return [];
    }

    const latestReadBooksPromise = users.map(async user => {
        const userBooks = readBooks.filter(book => book.user_id === user.id);

        if (userBooks.length === 0) {
            return { nickname: user.nickname, book: null };
        }

        const userBook = userBooks.reduce((a, b) =>
            new Date(a.finish_date!) > new Date(b.finish_date!) ? a : b
        );

        const dbBook = await databaseSearchBookByIsbn(userBook.isbn);

        const book = {
                isbn: userBook.isbn,
                title: dbBook.title,
                pages: userBook.pages !== null && userBook.pages !== '0' && userBook.pages !== 0 ? userBook.pages.toString() : dbBook.pages,
                current_page: userBook.current_page.toString(),
                cover_url: userBook.cover_url !== null ? userBook.cover_url : dbBook.cover_url,
                release_year: userBook.release_year !== null && userBook.release_year !== 0 ? userBook.release_year.toString() : dbBook.release_year,
                author: userBook.author !== null ? userBook.author : dbBook.author,
                rating: userBook.rating,
                start_date: userBook.start_date,
                finish_date: userBook.finish_date,
                created_at: userBook.created_at,
            } as Book;

        return { nickname: user.nickname, book };
    });

    const latestReadBooks = await Promise.all(latestReadBooksPromise);

    return latestReadBooks.filter(p => p.book !== null);
};
