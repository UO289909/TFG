import { useEffect, useState } from 'react';
import { Book } from '../../core/entities/book.entity';
import { getBooksByUser } from '../../core/use-cases/books/get-books-by-user.use-case';
import { getUserFriendNumber } from '../../core/use-cases/user/get-user-friend-number.use-case';


export const useFriend = (user: string) => {

    const [loadingFriendBooks, setLoadingFriendBooks] = useState(true)
    const [friendBooks, setFriendBooks] = useState<Book[]>([]);

    const [loadingFriendNumber, setLoadingFriendNumber] = useState(true)
    const [friendNumber, setFriendNumber] = useState(0);

    useEffect(() => {
        loadFriendBooks();
        loadFriendNumber();
    }, []);

    const loadFriendBooks = async () => {

        setLoadingFriendBooks(true);

        const books = await getBooksByUser(user);
        setFriendBooks(books);

        setLoadingFriendBooks(false);
    };

    const loadFriendNumber = async () => {

        setLoadingFriendNumber(true);

        const number = await getUserFriendNumber(user);
        setFriendNumber(number);

        setLoadingFriendNumber(false);
    }

    const refetch = async () => {
        await loadFriendBooks();
        await loadFriendNumber();
    };

    return {
        loadingFriendBooks,
        loadingFriendNumber,
        friendBooks,
        friendNumber,
        refetch,
    };
};