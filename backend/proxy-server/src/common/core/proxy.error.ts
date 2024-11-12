export class ProxyError extends Error {
    public readonly statusCode;
    public readonly originalError;
    private readonly NAME = 'ProxyError';

    constructor(message: string, statusCode: number, originalError?: Error) {
        super(message);

        this.statusCode = statusCode;
        this.originalError = originalError;
        this.name = this.NAME;
    }
}
