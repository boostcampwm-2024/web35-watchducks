import { ProxyError } from './core/proxy.error';

export class DatabaseQueryError extends ProxyError {
    constructor(originalError?: Error) {
        super(`데이터베이스 쿼리 중 문제가 발생했습니다.`, 404, originalError);
        this.name = 'DatabaseQueryError';
    }
}
