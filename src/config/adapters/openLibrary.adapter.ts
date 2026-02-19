import { AxiosAdapter } from './axios.adapter';

/**
 * Fetcher for getting a book by ISBN from OpenLibrary REST API
 */
export const openLibraryIsbnFetcher = new AxiosAdapter({
    baseUrl: 'https://openlibrary.org/api/books',
    apikey: '',
});

/**
 * Fetcher for searching books by name from OpenLibrary Search API
 */
export const openLibrarySearchFetcher = new AxiosAdapter({
    baseUrl: 'https://openlibrary.org/search.json',
    apikey: '',
});
