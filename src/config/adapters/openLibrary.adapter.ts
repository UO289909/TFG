import { AxiosAdapter } from './axios.adapter';

export const OpenLibraryAdapter = new AxiosAdapter({
    baseUrl: 'https://openlibrary.org/api/books?format=json&jscmd=data',
    params: {},
});
