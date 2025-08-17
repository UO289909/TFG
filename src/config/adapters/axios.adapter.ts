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

    async get<T>( url: string, options?: { headers?: Record<string, string>, params?: Record<string, string> } ): Promise<T> {
        try {
            const { data } = await this.axiosInstance.get<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error fetching get: ${ url }`);
        }
    }

    async post<T>( url: string, body: unknown, options?: { headers?: Record<string, string> } ): Promise<T> {
        try {
            const { data } = await this.axiosInstance.post<T>(url, body, options);
            return data;
        } catch (error) {
            throw new Error(`Error posting to: ${ url }`);
        }
    }

    async patch<T>( url: string, body: unknown, options?: { headers?: Record<string, string> } ): Promise<T> {
        try {
            const { data } = await this.axiosInstance.patch<T>(url, body, options);
            return data;
        } catch (error) {
            throw new Error(`Error patching to: ${ url }`);
        }
    }

    async delete<T>( url: string, options?: { headers?: Record<string, string> } ): Promise<T> {
        try {
            const { data } = await this.axiosInstance.delete<T>(url, options);
            return data;
        } catch (error) {
            throw new Error(`Error deleting from: ${ url }`);
        }
    }
}
