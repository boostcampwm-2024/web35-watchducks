export interface ErrorLog {
    method: string;
    host: string;
    path: string;
    request: {
        method: string;
        host: string;
        path?: string;
        headers: {
            'user-agent'?: string | undefined;
            'content-type'?: string | undefined;
            'x-forwarded-for'?: string | string[] | undefined;
        };
    };
    error: {
        message: string;
        name: string;
        stack?: string;
        originalError?: unknown;
    };
}
