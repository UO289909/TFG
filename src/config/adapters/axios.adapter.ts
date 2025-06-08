import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from './http.adapter';

interface Options {
    baseUrl: string;
    apikey: string;
}

export class AxiosAdapter implements HttpAdapter {

    private axiosInstance: AxiosInstance;

    constructor( options: Options ) {
        this.axiosInstance = axios.create({
            baseURL: options.baseUrl,
            headers: {
                apikey: options.apikey,
            },
        });
    }

    async get<T>( url: string, options?: { headers?: Record<string, string> } ): Promise<T> {
        try {
            const { data } = await this.axiosInstance.get<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error fetching get: ${ url }`);
        }
    }
}
