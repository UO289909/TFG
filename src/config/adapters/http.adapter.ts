export abstract class HttpAdapter {
    abstract get<T>( url: string, options?: { headers?: Record<string, string>, params?: Record<string, string> } ): Promise<T>;
    abstract post<T>( url: string, body: unknown, options?: { headers?: Record<string, string> } ): Promise<T>;
}
