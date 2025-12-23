import { useEffect, useState } from 'react';
import { Book } from '../../core/entities/book.entity';
import { getMyBooks } from '../../core/use-cases/books';


export const useBooks = () => {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ myBooks, setMyBooks ] = useState<Book[]>([]);

    useEffect(() => {
        loadMyBooks();
    }, []);

    const loadMyBooks = async () => {

        setIsLoading(true);

        const myBooksFetched = await getMyBooks();
        setMyBooks(myBooksFetched);

        setIsLoading(false);
    };

    const refetch = async () => {
        await loadMyBooks();
    };

    return {
        isLoading,
        myBooks,
        refetch,
    };
};
