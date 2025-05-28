import { AxiosAdapter } from './axios.adapter';

export const OpenLibraryAdapter = new AxiosAdapter({
    baseUrl: 'https://openlibrary.org',
    params: {},
});
