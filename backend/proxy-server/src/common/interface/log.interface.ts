interface BaseLog {
    message: string;
    method: string;
    hostname: string;
    url: string;
    path?: string;
}

type RequestLog = BaseLog;

interface ResponseLog extends BaseLog {
    statusCode: number;
    statusMessage: string;
    responseTime: number;
}

interface ErrorLog extends BaseLog {
    request: {
        method: string;
        hostname: string;
        url: string;
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
