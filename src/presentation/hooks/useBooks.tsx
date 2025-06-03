import { useEffect, useState } from 'react';
import { Book } from '../../core/entities/book.entity';
import { getMyBooks } from '../../core/use-cases';
import { openLibraryFetcher } from '../../config/adapters/openLibrary.adapter';
import { signIn } from '../../infrastructure/database/auth.repository';


export const useBooks = () => {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ myBooks, setMyBooks ] = useState<Book[]>([]);

    useEffect(() => {
        loadMyMovies();
    }, []);

    const loadMyMovies = async () => {

        setIsLoading(true);

        signIn('dev@test.es', 'test');

        const myBooksFetched = await getMyBooks(openLibraryFetcher);
        setMyBooks(myBooksFetched);

        setIsLoading(false);
    };

    return {
        isLoading,
        myBooks,
    };
};
