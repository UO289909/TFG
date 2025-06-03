import { AxiosAdapter } from './axios.adapter';

export const openLibraryFetcher = new AxiosAdapter({
    baseUrl: 'https://openlibrary.org/api/books?format=json&jscmd=data',
    params: {},
});
