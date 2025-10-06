import { databaseGetUserReadBooks } from '../../../infrastructure/database/books.repository';
import { Book } from '../../entities/book.entity';
import { User } from '../../entities/user.entity';


export const getUsersRecentReads = async (
    users: User[],
): Promise<{nickname: string, book: Book}[]> => {

    const lastReadBooks = users.map(async (user) => {
        const book = await databaseGetUserReadBooks(user.id, 0, 1);
        return book !== null ? { nickname: user.nickname, book: book}
    })

};
