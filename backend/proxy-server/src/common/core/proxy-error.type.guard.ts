import type { ProxyError } from './proxy.error';

export function isProxyError(error: unknown): error is ProxyError {
    return error instanceof Error && 'statusCode' in error;
}
