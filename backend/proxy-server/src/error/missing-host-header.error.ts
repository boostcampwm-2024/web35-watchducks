import { ProxyError } from './core/proxy.error';

export class MissingHostHeaderError extends ProxyError {
    constructor() {
        super('요청에 Host 헤더가 없습니다.', 400);
        this.name = 'NotFoundHeaderError';
    }
}
