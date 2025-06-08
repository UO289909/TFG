export abstract class HttpAdapter {
    abstract get<T>( url: string, options?: { headers?: Record<string, string> } ): Promise<T>;
}
