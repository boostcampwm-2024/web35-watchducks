
export interface ApplicationErrorContext {
    statusCode: number;
    message: string;
    originalError?: Error;
}
