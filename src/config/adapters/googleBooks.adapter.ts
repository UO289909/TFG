import { AxiosAdapter } from './axios.adapter';

export const GoogleBooksAdapter = new AxiosAdapter({
    baseUrl: 'https://www.googleapis.com/books/v1/volumes',
    params: {
        key: 'AIzaSyCt43sLi936c0xStt5XVDYyXWAQcpIYZjc',
    },
});
