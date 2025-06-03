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

        console.log('Starting sign in...');
        await signIn('dev@test.es', 'test');
        console.log('Finished sign in!');

        console.log('Starting fetching...');
        const myBooksFetched = await getMyBooks(openLibraryFetcher);
        console.log('Finished fetching!');
        setMyBooks(myBooksFetched);

        setIsLoading(false);
    };

    return {
        isLoading,
        myBooks,
    };
};
