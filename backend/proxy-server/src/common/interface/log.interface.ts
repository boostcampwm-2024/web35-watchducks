interface BaseLog {
    method: string;
    host: string;
    path?: string;
}

type RequestLog = BaseLog;

interface ResponseLog extends BaseLog {
    statusCode: number;
    responseTime: number;
}

interface ErrorLog extends BaseLog {
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

export { BaseLog, RequestLog, ResponseLog, ErrorLog };
